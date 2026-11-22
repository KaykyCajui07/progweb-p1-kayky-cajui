import { clienteModel } from '../models/clienteModel.js';
import { locacaoModel } from '../models/locacaoModel.js';
import { erro } from '../utils/erro.js';

export const clienteService = {
  listar() {
    return clienteModel.listar();
  },

  buscarPorId(id) {
    const cliente = clienteModel.buscarPorId(id);
    if (!cliente) throw erro(404, 'Cliente não encontrado');
    return cliente;
  },

  criar({ nome, cpf, email } = {}) {
    // Regra 1: nome e cpf são obrigatórios
    if (!nome || !cpf) throw erro(400, 'Campos "nome" e "cpf" são obrigatórios');
    // Regra 2: cpf é único
    if (clienteModel.existeCpf(cpf)) throw erro(409, 'Já existe um cliente com este CPF');
    return clienteModel.inserir({ nome, cpf, email });
  },

  atualizar(id, dados = {}) {
    if (!clienteModel.buscarPorId(id)) throw erro(404, 'Cliente não encontrado');
    // Regra (S5): o CPF novo não pode ser de OUTRO cliente (senão o UNIQUE do banco daria 500)
    if (dados.cpf !== undefined) {
      const dono = clienteModel.buscarPorCpf(dados.cpf);
      if (dono && dono.id !== id) throw erro(409, 'Já existe um cliente com este CPF');
    }
    return clienteModel.atualizar(id, dados);
  },

  remover(id) {
    if (locacaoModel.existeAtivaDoCliente(id))
      throw erro(409, 'Cliente com locação ativa não pode ser removido');
    // Regra (S5): o histórico de locações é protegido pela chave estrangeira
    if (locacaoModel.existeDoCliente(id))
      throw erro(409, 'Cliente possui histórico de locações e não pode ser removido');
    const removido = clienteModel.remover(id);
    if (!removido) throw erro(404, 'Cliente não encontrado');
  },
};
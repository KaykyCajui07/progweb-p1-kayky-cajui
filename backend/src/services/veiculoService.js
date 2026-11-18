import { veiculoModel } from '../models/veiculoModel.js';
import { locacaoModel } from '../models/locacaoModel.js';
import { erro } from '../utils/erro.js';

export const veiculoService = {
  listar() {
    return veiculoModel.listar();
  },

  buscarPorId(id) {
    const veiculo = veiculoModel.buscarPorId(id);
    if (!veiculo) throw erro(404, 'Veículo não encontrado');
    return veiculo;
  },

  criar({ placa, marca, modelo, ano, cor, valorDiaria } = {}) {
    // Regra 1: placa é obrigatória
    if (!placa) throw erro(400, 'Campo "placa" é obrigatório');
    // Regra 2: placa é única
    if (veiculoModel.existePlaca(placa)) throw erro(409, 'Já existe um veículo com esta placa');
    // Regra 3: diária > 0 (precisa ser número: undefined <= 0 dá false)
    if (!(Number(valorDiaria) > 0)) throw erro(400, 'Campo "valorDiaria" deve ser maior que zero');
    // Todo veículo nasce disponível; depois, quem muda o status é a locação
    return veiculoModel.inserir({ placa, marca, modelo, ano, cor, valorDiaria, status: 'disponivel' });
  },

  atualizar(id, { status, ...dados } = {}) { // status não é editável à mão
    const atual = veiculoModel.buscarPorId(id);
    if (!atual) throw erro(404, 'Veículo não encontrado');
    if (dados.placa !== undefined && dados.placa !== atual.placa && veiculoModel.existePlaca(dados.placa))
      throw erro(409, 'Já existe um veículo com esta placa');
    if (dados.valorDiaria !== undefined && !(Number(dados.valorDiaria) > 0))
      throw erro(400, 'Campo "valorDiaria" deve ser maior que zero');
    return veiculoModel.atualizar(id, dados);
  },

  remover(id) {
    if (locacaoModel.existeAtivaDoVeiculo(id)) throw erro(409, 'Veículo com locação ativa não pode ser removido');
    const removido = veiculoModel.remover(id);
    if (!removido) throw erro(404, 'Veículo não encontrado');
  },
};
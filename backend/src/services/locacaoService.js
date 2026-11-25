import { locacaoModel } from '../models/locacaoModel.js';
import { veiculoModel } from '../models/veiculoModel.js';
import { clienteModel } from '../models/clienteModel.js';
import { erro } from '../utils/erro.js';

// Regra de negócio da locadora (MODELAGEM.md): locar e devolver.

export const locacaoService = {
  listar() {
    return locacaoModel.listar();
  },

  buscarPorId(id) {
    const locacao = locacaoModel.buscarPorId(id);
    if (!locacao) throw erro(404, 'Locação não encontrada');
    return locacao;
  },

  locar({ veiculoId, clienteId } = {}) {
    veiculoId = Number(veiculoId);
    clienteId = Number(clienteId);

    // Regra 1: os dois ids são obrigatórios
    if (!Number.isInteger(veiculoId) || !Number.isInteger(clienteId))
      throw erro(400, 'Campos "veiculoId" e "clienteId" são obrigatórios');
    // Regra 2: cliente e veículo precisam existir
    if (!clienteModel.buscarPorId(clienteId)) throw erro(404, 'Cliente não encontrado');
    const veiculo = veiculoModel.buscarPorId(veiculoId);
    if (!veiculo) throw erro(404, 'Veículo não encontrado');
    // Regra 3: só se aluga veículo disponível
    if (veiculo.status !== 'disponivel') throw erro(409, 'Veículo não está disponível');

    const locacao = locacaoModel.inserir({
      veiculoId,
      clienteId,
      dataRetirada: new Date().toISOString(),
    });
    veiculoModel.atualizar(veiculoId, { status: 'alocado' });
    return locacao;
  },

  devolver(id) {
    const locacao = this.buscarPorId(id);
    // Regra: só se devolve uma locação ativa
    if (locacao.status !== 'ativa') throw erro(409, 'Esta locação já foi devolvida');

    const devolvida = locacaoModel.atualizar(id, {
      status: 'devolvida',
      dataDevolucao: new Date().toISOString(),
    });
    veiculoModel.atualizar(locacao.veiculoId, { status: 'disponivel' });
    return devolvida;
  },
};
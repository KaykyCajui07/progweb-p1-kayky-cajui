import { veiculoModel } from '../models/veiculoModel.js';
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

  criar({ placa, modelo, ano, cor, valorDiaria,status } = {}) {
    // Regra 1: placa é obrigatória
    if (!placa) throw erro(400, 'Campo "placa" é obrigatório');
    // Regra 2: placa é única
    if (veiculoModel.existePlaca(placa)) throw erro(409, 'Já existe um veículo com esta placa');
    // Regra 3: diaria > 0
    if (valorDiaria <= 0) throw erro(400, 'Campo "valorDiaria" deve ser maior que zero');
    return veiculoModel.inserir({ placa, modelo, ano, cor, valorDiaria,status });
  },

  atualizar(id, dados = {}) {
    const atualizado = veiculoModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Veículo não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = veiculoModel.remover(id);
    if (!removido) throw erro(404, 'Veículo não encontrado');
  },
};
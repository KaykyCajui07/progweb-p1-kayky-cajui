import { api } from '../api.js';

// Valida antes de gastar uma requisição. O backend valida de novo.
function preparar({ clienteId, veiculoId }) {
  if (!clienteId) throw new Error('Selecione o cliente.');
  if (!veiculoId) throw new Error('Selecione o veículo.');
  return { clienteId: Number(clienteId), veiculoId: Number(veiculoId) };
}

export const locacaoService = {
  listar() {
    return api.get('/locacoes');
  },

  async criar(dados) {
    return api.post('/locacoes', preparar(dados));
  },

  devolver(id) {
    return api.post(`/locacoes/${id}/devolucao`, {});
  },
};
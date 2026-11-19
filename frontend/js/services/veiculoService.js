import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo: nunca confie só no front.
function preparar({ placa, marca, modelo, ano, cor, valorDiaria }) {
  const dados = {
    placa: (placa ?? '').trim().toUpperCase(),
    marca: (marca ?? '').trim(),
    modelo: (modelo ?? '').trim(),
    ano: Number(ano),                 // campo numérico chega como string
    cor: (cor ?? '').trim() || null,
    valorDiaria: Number(valorDiaria),
  };
  if (!dados.placa) throw new Error('Informe a placa.');
  if (!dados.marca) throw new Error('Informe a marca.');
  if (!dados.modelo) throw new Error('Informe o modelo.');
  if (!Number.isInteger(dados.ano) || dados.ano < 1900) throw new Error('Informe um ano válido.');
  if (!(dados.valorDiaria > 0)) throw new Error('A diária deve ser maior que zero.');
  return dados;
}

export const veiculoService = {
  listar() {
    return api.get('/veiculos');
  },

  async criar(dados) {
    return api.post('/veiculos', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/veiculos/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/veiculos/${id}`);
  },
};
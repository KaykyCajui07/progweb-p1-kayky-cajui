// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let locacoes = [];
let proximoId = 1;

export const locacaoModel = {
  listar() {
    return locacoes;
  },

  buscarPorId(id) {
    return locacoes.find((l) => l.id === id) ?? null;
  },

  listarAtivas() {
    return locacoes.filter((l) => l.status === 'ativa');
  },

  existeAtivaDoCliente(clienteId) {
    return locacoes.some((l) => l.clienteId === clienteId && l.status === 'ativa');
  },

  existeAtivaDoVeiculo(veiculoId) {
    return locacoes.some((l) => l.veiculoId === veiculoId && l.status === 'ativa');
  },

  inserir({ veiculoId, clienteId, dataRetirada }) {
    const nova = { id: proximoId++, veiculoId, clienteId, dataRetirada, status: 'ativa' };
    locacoes.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = locacoes.findIndex((l) => l.id === id);
    if (i === -1) return null;
    locacoes[i] = { ...locacoes[i], ...dados, id }; // o id nunca muda
    return locacoes[i];
  },
};
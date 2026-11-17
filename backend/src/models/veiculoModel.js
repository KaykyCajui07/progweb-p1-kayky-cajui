// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let veiculos = [];
let proximoId = 1;

export const veiculoModel = {
  listar() {
    return veiculos;
  },

  buscarPorId(id) {
    return veiculos.find((c) => c.id === id) ?? null;
  },

  existePlaca(placa) {
    return veiculos.some((c) => c.placa === placa);
  },

  inserir({ placa, modelo, ano, cor, valorDiaria,status }) {
    const novo = { id: proximoId++, placa, modelo, ano, cor, valorDiaria,status };
    veiculos.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = veiculos.findIndex((c) => c.id === id);
    if (i === -1) return null;
    veiculos[i] = { ...veiculos[i], ...dados, id }; // o id nunca muda
    return veiculos[i];
  },

  remover(id) {
    const antes = veiculos.length;
    veiculos = veiculos.filter((c) => c.id !== id);
    return veiculos.length < antes; // true = removeu
  },



  
};
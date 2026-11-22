// "Banco de dados" em memória: um array. Na S5 vira SQLite.
import { db } from '../db.js';

// No banco: snake_case. No JSON da API: camelCase (clienteId, veiculoId...).
const COLUNAS = `id, cliente_id AS clienteId, veiculo_id AS veiculoId,
  data_retirada AS dataRetirada, data_devolucao AS dataDevolucao, status`;

export const locacaoModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM locacoes ORDER BY id`).all();
  },

  buscarPorId(id) {
    return db.prepare(`SELECT ${COLUNAS} FROM locacoes WHERE id = ?`).get(id) ?? null;
  },

  listarAtivas() {
    return db
      .prepare(`SELECT ${COLUNAS} FROM locacoes WHERE status = 'ativa' ORDER BY id`)
      .all();
  },

  existeAtivaDoCliente(clienteId) {
    return db
      .prepare(`SELECT 1 FROM locacoes WHERE cliente_id = ? AND status = 'ativa'`)
      .get(clienteId) !== undefined;
  },

  existeAtivaDoVeiculo(veiculoId) {
    return db
      .prepare(`SELECT 1 FROM locacoes WHERE veiculo_id = ? AND status = 'ativa'`)
      .get(veiculoId) !== undefined;
  },

  // Qualquer locação (ativa ou devolvida): é o histórico que a chave estrangeira protege
  existeDoCliente(clienteId) {
    return db.prepare('SELECT 1 FROM locacoes WHERE cliente_id = ?').get(clienteId) !== undefined;
  },

  existeDoVeiculo(veiculoId) {
    return db.prepare('SELECT 1 FROM locacoes WHERE veiculo_id = ?').get(veiculoId) !== undefined;
  },

  inserir({ veiculoId, clienteId, dataRetirada }) {
    const r = db
      .prepare(`INSERT INTO locacoes (cliente_id, veiculo_id, data_retirada, status)
                VALUES (?, ?, ?, 'ativa')`)
      .run(Number(clienteId), Number(veiculoId), dataRetirada);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare(`UPDATE locacoes
                SET cliente_id = ?, veiculo_id = ?, data_retirada = ?,
                    data_devolucao = ?, status = ?
                WHERE id = ?`)
      .run(
        Number(novo.clienteId),
        Number(novo.veiculoId),
        novo.dataRetirada,
        novo.dataDevolucao ?? null,
        novo.status,
        id,
      );
    return this.buscarPorId(id);
  },
};
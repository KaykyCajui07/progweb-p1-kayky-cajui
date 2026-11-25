// "Banco de dados" em memória: um array. Na S5 vira SQLite.
import { db } from '../db.js';


export const clienteModel = {
  listar() {
    return db.prepare('SELECT * FROM clientes ORDER BY id').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id) ?? null;
  },

  buscarPorCpf(cpf) {
    return db.prepare('SELECT * FROM clientes WHERE cpf = ?').get(cpf) ?? null;
  },

  existeCpf(cpf) {
    return db.prepare('SELECT 1 FROM clientes WHERE cpf = ?').get(cpf) !== undefined;
  },

  existeNome(nome) {
    return db.prepare('SELECT 1 FROM clientes WHERE nome = ?').get(nome) !== undefined;
  },

  inserir({ nome, cpf, email }) {
    const r = db
      .prepare('INSERT INTO clientes (nome, cpf, email) VALUES (?, ?, ?)')
      .run(nome, cpf, email ?? null);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE clientes SET nome = ?, cpf = ?, email = ? WHERE id = ?')
      .run(novo.nome, novo.cpf, novo.email ?? null, id); // o id nunca muda
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
    return r.changes > 0; // true = removeu
  },
};

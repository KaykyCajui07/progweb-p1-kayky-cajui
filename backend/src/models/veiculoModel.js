// "Banco de dados" em memória: um array. Na S5 vira SQLite.
import { db } from '../db.js';

// No banco: snake_case (valor_diaria). No JSON da API: camelCase (valorDiaria).
const COLUNAS = `id, placa, marca, modelo, ano, cor,
  valor_diaria AS valorDiaria, status`;

export const veiculoModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM veiculos ORDER BY id`).all();
  },

  buscarPorId(id) {
    return db.prepare(`SELECT ${COLUNAS} FROM veiculos WHERE id = ?`).get(id) ?? null;
  },

  existePlaca(placa) {
    return db.prepare('SELECT 1 FROM veiculos WHERE placa = ?').get(placa) !== undefined;
  },

  inserir({ placa, marca, modelo, ano, cor, valorDiaria, status }) {
    const r = db
      .prepare(`INSERT INTO veiculos (placa, marca, modelo, ano, cor, valor_diaria, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(
        placa,
        marca ?? null,
        modelo ?? null,
        ano == null ? null : Number(ano),
        cor ?? null,
        Number(valorDiaria),
        status ?? 'disponivel',
      );
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare(`UPDATE veiculos
                SET placa = ?, marca = ?, modelo = ?, ano = ?, cor = ?,
                    valor_diaria = ?, status = ?
                WHERE id = ?`)
      .run(
        novo.placa,
        novo.marca ?? null,
        novo.modelo ?? null,
        novo.ano == null ? null : Number(novo.ano),
        novo.cor ?? null,
        Number(novo.valorDiaria),
        novo.status,
        id, // o id nunca muda
      );
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM veiculos WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
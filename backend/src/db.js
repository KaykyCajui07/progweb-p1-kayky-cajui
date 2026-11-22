import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// As tabelas "pai" (clientes, veiculos) vêm antes da "filha" (locacoes).
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT NOT NULL,
    cpf   TEXT NOT NULL UNIQUE,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS veiculos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    placa        TEXT NOT NULL UNIQUE,
    marca        TEXT,
    modelo       TEXT,
    ano          INTEGER,
    cor          TEXT,
    valor_diaria REAL NOT NULL CHECK (valor_diaria > 0),
    status       TEXT NOT NULL DEFAULT 'disponivel'
                 CHECK (status IN ('disponivel', 'alocado'))
  );

  CREATE TABLE IF NOT EXISTS locacoes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id     INTEGER NOT NULL REFERENCES clientes(id),
    veiculo_id     INTEGER NOT NULL REFERENCES veiculos(id),
    data_retirada  TEXT NOT NULL,
    data_devolucao TEXT,
    status         TEXT NOT NULL DEFAULT 'ativa'
                   CHECK (status IN ('ativa', 'devolvida'))
  );

  -- Um veículo não pode ter duas locações ativas ao mesmo tempo
  CREATE UNIQUE INDEX IF NOT EXISTS uq_locacao_ativa_veiculo
    ON locacoes(veiculo_id) WHERE status = 'ativa';
`);

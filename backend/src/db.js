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

// Dados de exemplo: só entram se o banco estiver vazio.
// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM clientes').get();
if (total === 0) {
  const inserirCliente = db.prepare(
    'INSERT INTO clientes (nome, cpf, email) VALUES (?, ?, ?)'
  );
  const inserirVeiculo = db.prepare(
    `INSERT INTO veiculos (placa, marca, modelo, ano, cor, valor_diaria, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const ana = inserirCliente.run('Ana Silva', '11122233344', 'ana@exemplo.com');
  inserirCliente.run('Bruno Souza', '55566677788', 'bruno@exemplo.com');

  const argo = inserirVeiculo.run('ABC1D23', 'Fiat', 'Argo', 2022, 'Branco', 120, 'alocado');
  inserirVeiculo.run('DEF4G56', 'Chevrolet', 'Onix', 2023, 'Preto', 135, 'disponivel');
  inserirVeiculo.run('HIJ7K89', 'Volkswagen', 'T-Cross', 2021, 'Cinza', 180, 'disponivel');

  // Uma locação ativa: o veículo dela já nasce "alocado" 
  db.prepare(
    `INSERT INTO locacoes (cliente_id, veiculo_id, data_retirada, status)
     VALUES (?, ?, ?, 'ativa')`
  ).run(ana.lastInsertRowid, argo.lastInsertRowid, new Date().toISOString());
}
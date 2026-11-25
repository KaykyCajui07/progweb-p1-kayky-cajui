````markdown
# Locadora de Veiculos


Uma ou duas frases: o que o sistema faz e para quem.
Projeto 1 da disciplina Programação Web (UEPB, 2026.2).


- **Aplicação:** https://SEU-FRONT.vercel.app
- **API:** https://SEU-SERVICO.onrender.com
- **Vídeo de apresentação:** (link)


> A API está no plano grátis do Render: o primeiro acesso pode levar cerca de
> um minuto, e os dados voltam aos de exemplo a cada reinício do serviço.


## Tecnologias


- Backend: Node.js 22, Express 5, SQLite (`node:sqlite`, SQL puro)
- Frontend: HTML, CSS, Bootstrap 5, JavaScript puro (ES Modules, `fetch`)


## Como rodar localmente


Pré-requisito: Node.js 22 ou superior.


```bash
# 1. API
cd backend
npm install
cp .env.example .env
npm run dev                      # http://localhost:3000


# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

## Rotas da API

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | / | Health check (nome, versão e rotas da API) | 200 |
| GET | /clientes | Lista os clientes | 200 |
| POST | /clientes | Cria um cliente | 201, 400, 409 |
| GET | /clientes/:id | Busca um cliente | 200, 404 |
| PUT | /clientes/:id | Atualiza um cliente | 200, 404, 409 |
| DELETE | /clientes/:id | Remove um cliente | 204, 404, 409 |
| GET | /veiculos | Lista os veículos | 200 |
| POST | /veiculos | Cria um veículo | 201, 400, 409 |
| GET | /veiculos/:id | Busca um veículo | 200, 404 |
| PUT | /veiculos/:id | Atualiza um veículo | 200, 400, 404, 409 |
| DELETE | /veiculos/:id | Remove um veículo | 204, 404, 409 |
| GET | /locacoes | Lista as locações | 200 |
| POST | /locacoes | Registra uma locação | 201, 400, 404, 409 |
| GET | /locacoes/:id | Busca uma locação | 200, 404 |
| POST | /locacoes/:id/devolucao | Devolve uma locação | 200, 404, 409 |
Erros seguem o formato `{ "erro": "mensagem" }`.


## Regras de negócio


- (uma linha por regra: o que é validado e qual status devolve)


## Estrutura


```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, chama o service, responde
    services/      regras de negócio
    models/        acesso ao banco (SQL)
    middleware/    logger e tratamento de erros
    db.js          conexão e schema do SQLite
frontend/
  js/
    api.js         camada HTTP (fetch)
    services/      regras da tela
    state/         estado da aplicação
    ui/            desenho da tela
MODELAGEM.md       modelagem de classes (S2)
s1/ … s4/          exercícios das semanas
```


## Autor


Kayky da Costa Cajui · Ciência da Computação · UEPB
````

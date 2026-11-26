````markdown
# Locadora de Veiculos


Sistema para controlar o aluguel de veículos de uma locadora: cadastro de clientes e veículos, locação e devolução.
Projeto 1 da disciplina Programação Web (UEPB, 2026.2).


- **Aplicação:** https://p1-kaykycajui.vercel.app
- **API:** https://p1-kaykycajui-api.onrender.com
- **Vídeo de apresentação:** https://youtu.be/s-2mNbQOeNE


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

- Cliente exige `nome` e `cpf` (400); o CPF é único (409).
- Veículo exige `placa` e `valorDiaria` maior que zero (400); a placa é única (409).
- Todo veículo novo nasce `disponivel`.
- Só é possível alugar veículo `disponivel` (409); cliente e veículo precisam existir (404).
- Ao locar, o veículo passa a `alocado`; ao devolver, volta a `disponivel`.
- Devolver uma locação já devolvida retorna 409.
- Não é possível remover cliente ou veículo com locação ativa ou com histórico de locações (409).
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

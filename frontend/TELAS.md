# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/src/` (porta 3001)

## Os quatro estados de cada lista

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Clientes | carregando | DevTools → Network → throttling "Slow 3G" → F5 | spinner "Carregando clientes…" |
| Clientes | vazio | API recém-iniciada | "Nenhum cliente ainda. Cadastre o primeiro no formulário." |
| Clientes | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão **Tentar de novo** |
| Clientes | sucesso | cadastrar "Ana Silva" com CPF `123.456.789-00` | tabela com 1 linha (CPF formatado) |
| Veículos | carregando | Network → throttling "Slow 3G" → F5 | spinner "Carregando veículos…" |
| Veículos | vazio | API recém-iniciada | "Nenhum veículo ainda. Cadastre o primeiro no formulário." |
| Veículos | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + **Tentar de novo** |
| Veículos | sucesso | cadastrar placa `ABC1D23`, Fiat Argo, 2022, diária 120 | tabela com 1 linha, status "Disponível", diária "R$ 120,00" |
| Locações | carregando | Network → throttling "Slow 3G" → F5 | spinner "Carregando locações…" |
| Locações | vazio | API recém-iniciada | "Nenhuma locação ainda. Escolha um cliente e um veículo para registrar a primeira." |
| Locações | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + **Tentar de novo** |
| Locações | sucesso | escolher Ana Silva + `ABC1D23` → **Registrar locação** | tabela com 1 linha mostrando o **nome** do cliente e a placa, status "Ativa" |

Com a API fora do ar, as três listas entram em erro ao mesmo tempo. Religue a API e use **Tentar de novo** em cada uma.

## Erros de regra (vindos do backend ou do front)

O texto sempre aparece no aviso vermelho no topo da página. O formulário não é limpo, para a pessoa corrigir.

| Onde | Como provocar | Aviso | Origem |
|---|---|---|---|
| Clientes | cadastrar dois clientes com o mesmo CPF | "Já existe um cliente com este CPF" | backend, 409 |
| Clientes | CPF com menos de 11 dígitos | "O CPF precisa ter 11 dígitos." | front (nem chega à API) |
| Veículos | cadastrar duas vezes a mesma placa | "Já existe um veículo com esta placa" | backend, 409 |
| Veículos | diária `-1` | "A diária deve ser maior que zero." | front (nem chega à API) |
| Locações | clicar em **Registrar locação** sem escolher cliente | "Selecione o cliente." | front |
| Locações | abrir o painel em duas abas; na aba A, alugar o veículo; na aba B (ainda desatualizada), escolher o mesmo veículo e registrar | "Veículo não está disponível" | backend, 409 |
| Clientes / Veículos | remover um cliente ou veículo que tem locação **ativa** | "Cliente com locação ativa não pode ser removido" / "Veículo com locação ativa não pode ser removido" | backend, 409 |


## Camadas

- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/` · config: `js/config.js`
- `main.js` só liga as camadas: nenhuma regra mora nele.
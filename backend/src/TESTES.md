# Testes da API — Projeto 1 (S3)

API: Locadora de Veiculos · entidades: Veiculo e Cliente· servidor: `npm run dev` em http://localhost:3001

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | POST | /clientes |{"nome":"Ana Silva","cpf":"123.456.789-00","email":"ana@email.com"} | 201 | |
| 2 | POST | /clientes |{"nome":"Kayky Cajui","cpf":"400.289.222-52","email":"kaykyplaystation@email.com"} | 201 | |
| 3 | POST | /veiculos | {"placa":"ABC1D23","marca":"Fiat","modelo":"Argo","ano":2022,"cor":"Preto","valorDiaria":120,"status":"disponivel"} | 201 | |
| 4 | GET | /clientes | — | 200 | filtro 1:N|
| 5 | GET | /veiculos/99 | — | 404 | |
| 6 | POST | /veiculos |{"placa":"XYZ9K88","marca":"Fiat","modelo":"Argo","ano":2022,"cor":"Rosa","valorDiaria":-10,"status":"disponivel"} | 400 | regra: valorDiaria > 0 |
| 7 | DELETE | /cliente/2 | — | 204 | |
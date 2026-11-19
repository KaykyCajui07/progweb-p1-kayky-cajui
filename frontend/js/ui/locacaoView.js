// Camada de UI: a única que toca no DOM das locações.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
const el = {
  form: document.querySelector('#form-locacao'),
  cliente: document.querySelector('#loc-cliente'),
  veiculo: document.querySelector('#loc-veiculo'),
  salvar: document.querySelector('#loc-salvar'),
  carregando: document.querySelector('#locacoes-carregando'),
  erro: document.querySelector('#locacoes-erro'),
  erroMsg: document.querySelector('#locacoes-erro-msg'),
  recarregar: document.querySelector('#locacoes-recarregar'),
  vazio: document.querySelector('#locacoes-vazio'),
  sucesso: document.querySelector('#locacoes-sucesso'),
  linhas: document.querySelector('#locacoes-linhas'),
};

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto; // dado do usuário entra como TEXTO, nunca como HTML
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function opcao(valor, texto) {
  const o = document.createElement('option');
  o.value = valor;
  o.textContent = texto;
  return o;
}

// Reconstrói as opções sem perder o que a pessoa já escolheu.
function preencherSelect(select, itens, rotuloVazio) {
  const atual = select.value;
  select.replaceChildren(
    opcao('', itens.length ? 'Selecione…' : rotuloVazio),
    ...itens.map(([valor, texto]) => opcao(valor, texto)),
  );
  select.value = atual;
}

function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function celulaStatus(status) {
  const ativa = status === 'ativa';
  const selo = document.createElement('span');
  selo.className = `badge ${ativa ? 'text-bg-warning' : 'text-bg-secondary'}`;
  selo.textContent = ativa ? 'Ativa' : 'Devolvida';
  const td = document.createElement('td');
  td.append(selo);
  return td;
}

function linha(locacao, clientes, veiculos) {
  const cliente = clientes.find((c) => c.id === locacao.clienteId);
  const veiculo = veiculos.find((v) => v.id === locacao.veiculoId);

  const tr = document.createElement('tr');
  const acoes = celula('', 'text-end text-nowrap');
  if (locacao.status === 'ativa') {
    acoes.append(botao('Devolver', 'devolver', locacao.id, 'btn-outline-success'));
  }

  tr.append(
    celula(locacao.id),
    celula(cliente ? cliente.nome : `Cliente #${locacao.clienteId}`),
    celula(veiculo ? `${veiculo.placa} · ${veiculo.modelo}` : `Veículo #${locacao.veiculoId}`),
    celula(formatarData(locacao.dataRetirada), 'numero text-nowrap'),
    celulaStatus(locacao.status),
    acoes,
  );
  return tr;
}

export const locacaoView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  // clientes e veiculos vêm dos outros stores (só leitura): nomes na tabela
  // e a decisão de habilitar o botão. As opções dos <select> ficam nos preencher*.
  render({ status, locacoes, erro, salvando, clientes, veiculos }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...locacoes.map((l) => linha(l, clientes, veiculos)));

    const disponiveis = veiculos.filter((v) => v.status === 'disponivel');
    el.salvar.disabled = salvando || !clientes.length || !disponiveis.length;
    el.salvar.textContent = salvando ? 'Registrando…' : 'Registrar locação';
  },

  // Religa os <select> quando a lista do "pai" muda (chamado pelo main.js).
  preencherClientes(clientes) {
    preencherSelect(el.cliente, clientes.map((c) => [c.id, c.nome]), 'Nenhum cliente cadastrado');
  },

  // Só veículos disponíveis podem ser alugados.
  preencherVeiculos(veiculos) {
    const disponiveis = veiculos.filter((v) => v.status === 'disponivel');
    preencherSelect(
      el.veiculo,
      disponiveis.map((v) => [v.id, `${v.placa} · ${v.marca ?? ''} ${v.modelo ?? ''}`.trim()]),
      'Nenhum veículo disponível',
    );
  },

  limparForm() {
    el.form.reset();
  },

  // --- Eventos: a view avisa; quem decide o que fazer é o main.js ---
  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ devolver }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'devolver') devolver(id);
    });
  },
};
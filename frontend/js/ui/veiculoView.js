// Camada de UI: a única que toca no DOM dos veículos.
// Não faz fetch e não valida regra: desenha o estado e avisa dos eventos.
const el = {
  form: document.querySelector('#form-veiculo'),
  salvar: document.querySelector('#vei-salvar'),
  cancelar: document.querySelector('#vei-cancelar'),
  carregando: document.querySelector('#veiculos-carregando'),
  erro: document.querySelector('#veiculos-erro'),
  erroMsg: document.querySelector('#veiculos-erro-msg'),
  recarregar: document.querySelector('#veiculos-recarregar'),
  vazio: document.querySelector('#veiculos-vazio'),
  sucesso: document.querySelector('#veiculos-sucesso'),
  linhas: document.querySelector('#veiculos-linhas'),
};

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

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
  b.dataset.acao = acao; // vira data-acao="editar" no HTML
  b.dataset.id = id;
  return b;
}

function celulaStatus(status) {
  const disponivel = status === 'disponivel';
  const selo = document.createElement('span');
  selo.className = `badge ${disponivel ? 'text-bg-success' : 'text-bg-secondary'}`;
  selo.textContent = disponivel ? 'Disponível' : 'Alocado';
  const td = document.createElement('td');
  td.append(selo);
  return td;
}

function linha(veiculo, editandoId) {
  const tr = document.createElement('tr');
  if (veiculo.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', veiculo.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', veiculo.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(veiculo.id),
    celula(veiculo.placa, 'placa text-nowrap'),
    celula(`${veiculo.marca ?? ''} ${veiculo.modelo ?? ''}`.trim() || '—'),
    celula(veiculo.ano ?? '—', 'numero'),
    celula(veiculo.cor ?? '—'),
    celula(moeda.format(veiculo.valorDiaria), 'numero text-end text-nowrap'),
    celulaStatus(veiculo.status),
    acoes,
  );
  return tr;
}

export const veiculoView = {
  // Desenha a tela a partir do estado: a UI é função do estado.
  render({ status, veiculos, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...veiculos.map((v) => linha(v, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar veículo';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(veiculo) {
    el.form.placa.value = veiculo.placa;
    el.form.marca.value = veiculo.marca ?? '';
    el.form.modelo.value = veiculo.modelo ?? '';
    el.form.ano.value = veiculo.ano ?? '';
    el.form.cor.value = veiculo.cor ?? '';
    el.form.valorDiaria.value = veiculo.valorDiaria;
    el.form.placa.focus();
  },

  limparForm() {
    el.form.reset();
  },

  // --- Eventos: a view avisa; quem decide o que fazer é o main.js ---
  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault(); // sem isto, o navegador recarrega a página
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  // Delegação: UM listener no <tbody> atende os botões de todas as linhas.
  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id); // tudo que vem do DOM é string
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};

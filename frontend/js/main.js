// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { clienteService } from './services/clienteService.js';
import { veiculoService } from './services/veiculoService.js';
import { locacaoService } from './services/locacaoService.js';
import { clienteView } from './ui/clienteView.js';
import { veiculoView } from './ui/veiculoView.js';
import { locacaoView } from './ui/locacaoView.js';
import { aviso } from './ui/aviso.js';

// ===================== CLIENTES =====================
const clientes = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  clientes: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

clientes.assinar(clienteView.render);

async function carregarClientes() {
  clientes.set({ status: 'carregando', erro: null });
  try {
    const lista = await clienteService.listar();
    clientes.set({ status: lista.length ? 'sucesso' : 'vazio', clientes: lista });
  } catch (e) {
    clientes.set({ status: 'erro', erro: e.message });
  }
}

async function salvarCliente(dados) {
  const { editandoId } = clientes.get();
  aviso.limpar();
  clientes.set({ salvando: true });
  try {
    if (editandoId) await clienteService.atualizar(editandoId, dados);
    else await clienteService.criar(dados);

    aviso.sucesso(editandoId ? 'Cliente atualizado.' : 'Cliente cadastrado.');
    clienteView.limparForm();
    clientes.set({ editandoId: null });
    await carregarClientes();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    clientes.set({ salvando: false });
  }
}

function editarCliente(id) {
  const cliente = clientes.get().clientes.find((c) => c.id === id);
  clienteView.preencherForm(cliente);
  clientes.set({ editandoId: id });
}

function cancelarEdicaoCliente() {
  clienteView.limparForm();
  clientes.set({ editandoId: null });
}

async function removerCliente(id) {
  if (!confirm(`Remover o cliente #${id}?`)) return;
  aviso.limpar();
  try {
    await clienteService.remover(id);
    aviso.sucesso('Cliente removido.');
    if (clientes.get().editandoId === id) cancelarEdicaoCliente();
    await carregarClientes();
  } catch (e) {
    aviso.erro(e.message);
  }
}

clienteView.aoEnviar(salvarCliente);
clienteView.aoCancelar(cancelarEdicaoCliente);
clienteView.aoRecarregar(carregarClientes);
clienteView.aoClicarNaLista({ editar: editarCliente, remover: removerCliente });

// ===================== VEÍCULOS =====================
const veiculos = criarStore({
  status: 'carregando',
  veiculos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

veiculos.assinar(veiculoView.render);

async function carregarVeiculos() {
  veiculos.set({ status: 'carregando', erro: null });
  try {
    const lista = await veiculoService.listar();
    veiculos.set({ status: lista.length ? 'sucesso' : 'vazio', veiculos: lista });
  } catch (e) {
    veiculos.set({ status: 'erro', erro: e.message });
  }
}

async function salvarVeiculo(dados) {
  const { editandoId } = veiculos.get();
  aviso.limpar();
  veiculos.set({ salvando: true });
  try {
    if (editandoId) await veiculoService.atualizar(editandoId, dados);
    else await veiculoService.criar(dados);

    aviso.sucesso(editandoId ? 'Veículo atualizado.' : 'Veículo cadastrado.');
    veiculoView.limparForm();
    veiculos.set({ editandoId: null });
    await carregarVeiculos();
carregarLocacoes();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    veiculos.set({ salvando: false });
  }
}

function editarVeiculo(id) {
  const veiculo = veiculos.get().veiculos.find((v) => v.id === id);
  veiculoView.preencherForm(veiculo);
  veiculos.set({ editandoId: id });
}

function cancelarEdicaoVeiculo() {
  veiculoView.limparForm();
  veiculos.set({ editandoId: null });
}

async function removerVeiculo(id) {
  if (!confirm(`Remover o veículo #${id}?`)) return;
  aviso.limpar();
  try {
    await veiculoService.remover(id);
    aviso.sucesso('Veículo removido.');
    if (veiculos.get().editandoId === id) cancelarEdicaoVeiculo();
    await carregarVeiculos();
carregarLocacoes();
  } catch (e) {
    aviso.erro(e.message);
  }
}

veiculoView.aoEnviar(salvarVeiculo);
veiculoView.aoCancelar(cancelarEdicaoVeiculo);
veiculoView.aoRecarregar(carregarVeiculos);
veiculoView.aoClicarNaLista({ editar: editarVeiculo, remover: removerVeiculo });

// ===================== LOCAÇÕES =====================
const locacoes = criarStore({
  status: 'carregando',
  locacoes: [],
  erro: null,
  salvando: false,
});

// A view de locações também precisa de clientes e veículos (nomes e opções):
// ela redesenha quando qualquer um dos três stores mudar.
function desenharLocacoes() {
  locacaoView.render({
    ...locacoes.get(),
    clientes: clientes.get().clientes,
    veiculos: veiculos.get().veiculos,
  });
}
locacoes.assinar(desenharLocacoes);

// Quando a lista do "pai" muda, o <select> é religado e a tabela redesenhada.
clientes.assinar(({ clientes: lista }) => {
  locacaoView.preencherClientes(lista);
  desenharLocacoes();
});
veiculos.assinar(({ veiculos: lista }) => {
  locacaoView.preencherVeiculos(lista);
  desenharLocacoes();
});

async function carregarLocacoes() {
  locacoes.set({ status: 'carregando', erro: null });
  try {
    const lista = await locacaoService.listar();
    locacoes.set({ status: lista.length ? 'sucesso' : 'vazio', locacoes: lista });
  } catch (e) {
    locacoes.set({ status: 'erro', erro: e.message });
  }
}

async function registrarLocacao(dados) {
  aviso.limpar();
  locacoes.set({ salvando: true });
  try {
    await locacaoService.criar(dados);
    aviso.sucesso('Locação registrada.');
    locacaoView.limparForm();
    // o veículo passou a "alocado": recarrega as duas listas
    await Promise.all([carregarLocacoes(), carregarVeiculos()]);
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    locacoes.set({ salvando: false });
  }
}

async function devolverLocacao(id) {
  if (!confirm(`Registrar a devolução da locação #${id}?`)) return;
  aviso.limpar();
  try {
    await locacaoService.devolver(id);
    aviso.sucesso('Veículo devolvido.');
    await Promise.all([carregarLocacoes(), carregarVeiculos()]);
  } catch (e) {
    aviso.erro(e.message);
  }
}

locacaoView.aoEnviar(registrarLocacao);
locacaoView.aoRecarregar(carregarLocacoes);
locacaoView.aoClicarNaLista({ devolver: devolverLocacao });

// ===================== INÍCIO =====================
carregarClientes();
carregarVeiculos();
carregarLocacoes();
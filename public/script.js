const formulario = document.querySelector('#form-pessoa');
const lista = document.querySelector('#lista-pessoas');
const mensagem = document.querySelector('#mensagem');
const listaVazia = document.querySelector('#lista-vazia');

const campoNome = document.querySelector('#nome');
const campoCpf = document.querySelector('#cpf');
const campoData = document.querySelector('#dataNascimento');

const botaoSalvar = document.querySelector('#btn-salvar');
const botaoCancelar = document.querySelector('#btn-cancelar');
const tituloFormulario = document.querySelector('#titulo-formulario');

let cpfEmEdicao = null;

function mostrarMensagem(texto, tipo = 'sucesso') {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  const dados = resposta.status === 204 ? null : await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados?.erro || 'Erro na requisição');
  }

  return dados;
}

function criarCelula(linha, texto) {
  const celula = document.createElement('td');
  celula.textContent = String(texto);
  linha.appendChild(celula);
  return celula;
}

// REFACTOR: função reutilizável para criação de botões
function criarBotao(texto, classe, acao) {
  const botao = document.createElement('button');

  botao.type = 'button';
  botao.textContent = texto;
  botao.className = classe;
  botao.addEventListener('click', acao);

  return botao;
}

async function carregarPessoas() {
  try {
    const pessoas = await requisicao('/pessoas');

    lista.replaceChildren();
    listaVazia.hidden = pessoas.length !== 0;

    for (const pessoa of pessoas) {
      const linha = document.createElement('tr');

      criarCelula(linha, pessoa.nome);
      criarCelula(linha, pessoa.cpf);
      criarCelula(linha, formatarData(pessoa.dataNascimento));
      criarCelula(linha, `${pessoa.idade} anos`);

      const acoes = document.createElement('td');
      const grupo = document.createElement('div');
      grupo.className = 'acoes-tabela';

      const editar = criarBotao('Editar', 'secundario pequeno', () => {
        iniciarEdicao(pessoa);
      });

      const excluir = criarBotao('Excluir', 'excluir pequeno', () => {
        excluirPessoa(pessoa.cpf);
      });

      grupo.append(editar, excluir);
      acoes.appendChild(grupo);
      linha.appendChild(acoes);
      lista.appendChild(linha);
    }
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

function iniciarEdicao(pessoa) {
  cpfEmEdicao = pessoa.cpf;

  campoNome.value = pessoa.nome;
  campoCpf.value = pessoa.cpf;
  campoCpf.disabled = true;
  campoData.value = pessoa.dataNascimento;

  tituloFormulario.textContent = 'Editar pessoa';
  botaoSalvar.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;

  campoNome.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparFormulario() {
  formulario.reset();
  cpfEmEdicao = null;

  campoCpf.disabled = false;
  botaoSalvar.textContent = 'Cadastrar pessoa';
  tituloFormulario.textContent = 'Cadastrar pessoa';
  botaoCancelar.hidden = true;
}

async function excluirPessoa(cpf) {
  if (!window.confirm('Deseja realmente excluir esta pessoa?')) {
    return;
  }

  try {
    await requisicao(`/pessoas/${cpf}`, {
      method: 'DELETE'
    });

    if (cpfEmEdicao === cpf) {
      limparFormulario();
    }

    mostrarMensagem('Pessoa excluída com sucesso!');
    await carregarPessoas();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  }
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const dados = {
    nome: campoNome.value.trim(),
    cpf: campoCpf.value.trim(),
    dataNascimento: campoData.value
  };

  const editando = cpfEmEdicao !== null;
  const url = editando ? `/pessoas/${cpfEmEdicao}` : '/pessoas';

  botaoSalvar.disabled = true;

  try {
    await requisicao(url, {
      method: editando ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    limparFormulario();

    mostrarMensagem(
      editando
        ? 'Pessoa atualizada com sucesso!'
        : 'Pessoa cadastrada com sucesso!'
    );

    await carregarPessoas();
  } catch (erro) {
    mostrarMensagem(erro.message, 'erro');
  } finally {
    botaoSalvar.disabled = false;
  }
});

botaoCancelar.addEventListener('click', limparFormulario);

document
  .querySelector('#btn-atualizar')
  .addEventListener('click', carregarPessoas);

carregarPessoas();

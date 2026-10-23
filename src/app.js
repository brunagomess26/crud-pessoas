import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PessoasService } from './pessoas.service.js';

export function criarApp() {
  const app = express();
  const service = new PessoasService();

  // Permite receber dados JSON nas requisições
  app.use(express.json());

  // Disponibiliza os arquivos do frontend (HTML, CSS e JavaScript)
  const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));

  app.use(express.static(path.join(diretorioAtual, '../public')));

  // CREATE - Cadastrar pessoa
  app.post('/pessoas', (req, res) => {
    try {
      const pessoa = service.criar(req.body);
      return res.status(201).json(pessoa);
    } catch (erro) {
      return responderErro(res, erro);
    }
  });

  // READ - Listar todas as pessoas
  app.get('/pessoas', (req, res) => {
    return res.status(200).json(service.listar());
  });

  // READ - Consultar pessoa pelo CPF
  app.get('/pessoas/:cpf', (req, res) => {
    try {
      const pessoa = service.buscarPorCpf(req.params.cpf);
      return res.status(200).json(pessoa);
    } catch (erro) {
      return responderErro(res, erro);
    }
  });

  // UPDATE - Atualizar pessoa
  app.put('/pessoas/:cpf', (req, res) => {
    try {
      const pessoa = service.atualizar(req.params.cpf, req.body);
      return res.status(200).json(pessoa);
    } catch (erro) {
      return responderErro(res, erro);
    }
  });

  // DELETE - Excluir pessoa
  app.delete('/pessoas/:cpf', (req, res) => {
    const excluida = service.excluir(req.params.cpf);

    if (!excluida) {
      return res.status(404).json({
        erro: 'Pessoa não encontrada'
      });
    }

    return res.status(204).send();
  });

  return app;
}

// Tratamento de erros da API
function responderErro(res, erro) {
  if (erro.message === 'Pessoa não encontrada') {
    return res.status(404).json({
      erro: erro.message
    });
  }

  if (erro.message === 'CPF já cadastrado') {
    return res.status(409).json({
      erro: erro.message
    });
  }

  return res.status(400).json({
    erro: erro.message
  });
}

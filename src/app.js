
import express from 'express';
import { PessoasService } from './pessoas.service.js';

export function criarApp() {
  const app = express();
  const service = new PessoasService();

  app.use(express.json());

  app.post('/pessoas', (req, res) => {
    try {
      const pessoa = service.criar(req.body);
      return res.status(201).json(pessoa);
    } catch (erro) {
      return responderErro(res, erro);
    }
  });

  app.get('/pessoas', (req, res) => {
    return res.status(200).json(service.listar());
  });

  app.get('/pessoas/:cpf', (req, res) => {
    try {
      const pessoa = service.buscarPorCpf(req.params.cpf);
      return res.status(200).json(pessoa);
    } catch (erro) {
      return responderErro(res, erro);
    }
  });

  app.put('/pessoas/:cpf', (req, res) => {
    try {
      const pessoa = service.atualizar(
        req.params.cpf,
        req.body
      );
      return res.status(200).json(pessoa);
    } catch (erro) {
      return responderErro(res, erro);
    }
  });

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

function responderErro(res, erro) {
  if (erro.message === 'Pessoa não encontrada') {
    return res.status(404).json({ erro: erro.message });
  }

  if (erro.message === 'CPF já cadastrado') {
    return res.status(409).json({ erro: erro.message });
  }

  return res.status(400).json({ erro: erro.message });
}

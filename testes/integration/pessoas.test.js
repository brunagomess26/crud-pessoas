
import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { criarApp } from '../../src/app.js';

describe('API de Pessoas - Testes de Integração', () => {
  let app;

  const pessoa = {
    cpf: '12345678909',
    nome: 'Maria Silva',
    dataNascimento: '2000-05-10'
  };

  beforeEach(() => {
    app = criarApp();
  });

  it('POST /pessoas - deve cadastrar uma pessoa', async () => {
    const resposta = await request(app)
      .post('/pessoas')
      .send(pessoa);

    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe('Maria Silva');
    expect(resposta.body).toHaveProperty('idade');
  });

  it('GET /pessoas - deve listar as pessoas', async () => {
    await request(app).post('/pessoas').send(pessoa);

    const resposta = await request(app).get('/pessoas');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
  });

  it('GET /pessoas/:cpf - deve buscar uma pessoa', async () => {
    await request(app).post('/pessoas').send(pessoa);

    const resposta = await request(app)
      .get(`/pessoas/${pessoa.cpf}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.cpf).toBe(pessoa.cpf);
  });

  it('PUT /pessoas/:cpf - deve atualizar uma pessoa', async () => {
    await request(app).post('/pessoas').send(pessoa);

    const resposta = await request(app)
      .put(`/pessoas/${pessoa.cpf}`)
      .send({ nome: 'Maria Oliveira' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.nome).toBe('Maria Oliveira');
  });

  it('DELETE /pessoas/:cpf - deve excluir uma pessoa', async () => {
    await request(app).post('/pessoas').send(pessoa);

    const resposta = await request(app)
      .delete(`/pessoas/${pessoa.cpf}`);

    expect(resposta.status).toBe(204);

    const consulta = await request(app)
      .get(`/pessoas/${pessoa.cpf}`);

    expect(consulta.status).toBe(404);
  });

  it('deve rejeitar CPF duplicado', async () => {
    await request(app).post('/pessoas').send(pessoa);

    const resposta = await request(app)
      .post('/pessoas')
      .send(pessoa);

    expect(resposta.status).toBe(409);
  });

  it('deve rejeitar dados inválidos', async () => {
    const resposta = await request(app)
      .post('/pessoas')
      .send({
        cpf: '123',
        nome: '',
        dataNascimento: '2030-01-01'
      });

    expect(resposta.status).toBe(400);
  });
});

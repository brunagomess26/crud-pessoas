import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { criarApp } from '../../src/app.js';

describe('Frontend da aplicação', () => {
  it('deve disponibilizar a página inicial', async () => {
    const resposta = await request(criarApp()).get('/');

    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain('Gerenciamento de Pessoas');
    expect(resposta.text).toContain('form-pessoa');
  });

  it('deve disponibilizar o JavaScript do frontend', async () => {
    const resposta = await request(criarApp()).get('/script.js');

    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain('carregarPessoas');
  });

  it('deve disponibilizar o CSS', async () => {
    const resposta = await request(criarApp()).get('/style.css');

    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain('.container');
  });
});

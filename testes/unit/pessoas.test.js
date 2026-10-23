import { beforeEach, describe, expect, it } from 'vitest';
import { PessoasService } from '../../src/pessoas.service.js';

describe('CRUD de pessoas', () => {
  let service;

  const pessoa = {
    cpf: '12345678909',
    nome: 'Maria Silva',
    dataNascimento: '2000-05-10'
  };

  beforeEach(() => {
    service = new PessoasService();
  });

  it('deve cadastrar uma pessoa e calcular sua idade', () => {
    const resultado = service.criar(pessoa, new Date(2026, 9, 22));

    expect(resultado).toEqual({
      ...pessoa,
      idade: 26
    });
  });

  it('deve listar as pessoas cadastradas', () => {
    service.criar(pessoa);

    const lista = service.listar();

    expect(lista).toHaveLength(1);
    expect(lista[0].nome).toBe('Maria Silva');
  });

  it('deve buscar uma pessoa pelo CPF', () => {
    service.criar(pessoa);

    const resultado = service.buscarPorCpf('12345678909');

    expect(resultado.nome).toBe('Maria Silva');
  });

  it('deve atualizar o nome de uma pessoa', () => {
    service.criar(pessoa);

    const resultado = service.atualizar('12345678909', {
      nome: 'Maria Oliveira'
    });

    expect(resultado.nome).toBe('Maria Oliveira');
  });

  it('deve excluir uma pessoa', () => {
    service.criar(pessoa);

    const removida = service.excluir('12345678909');

    expect(removida).toBe(true);
    expect(service.listar()).toHaveLength(0);
  });

  it('não deve permitir CPF duplicado', () => {
    service.criar(pessoa);

    expect(() => service.criar(pessoa)).toThrow('CPF já cadastrado');
  });
});

import { describe, it, expect } from 'vitest';
import { calcularIdade } from '../../src/idade.js';

describe('Cálculo da idade', () => {
  it('deve calcular a idade após o aniversário', () => {
    const idade = calcularIdade('2000-05-10', new Date(2026, 9, 22));

    expect(idade).toBe(26);
  });

  it('deve considerar aniversário ainda não ocorrido', () => {
    const idade = calcularIdade('2000-12-10', new Date(2026, 9, 22));

    expect(idade).toBe(25);
  });
});

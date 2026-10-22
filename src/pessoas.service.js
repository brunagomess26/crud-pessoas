
import { calcularIdade } from './idade.js';

export class PessoasService {
  constructor() {
    this.pessoas = new Map();
  }

  criar(dados, dataReferencia = new Date()) {
    const { cpf, nome, dataNascimento } = dados;

    this.validarPessoa({ cpf, nome, dataNascimento });

    if (this.pessoas.has(cpf)) {
      throw new Error('CPF já cadastrado');
    }

    const pessoa = { cpf, nome, dataNascimento };

    this.pessoas.set(cpf, pessoa);

    return {
      ...pessoa,
      idade: calcularIdade(dataNascimento, dataReferencia)
    };
  }

  listar(dataReferencia = new Date()) {
    return Array.from(this.pessoas.values()).map(
      (pessoa) => ({
        ...pessoa,
        idade: calcularIdade(
          pessoa.dataNascimento,
          dataReferencia
        )
      })
    );
  }

  buscarPorCpf(cpf, dataReferencia = new Date()) {
    const pessoa = this.pessoas.get(cpf);

    if (!pessoa) {
      throw new Error('Pessoa não encontrada');
    }

    return {
      ...pessoa,
      idade: calcularIdade(
        pessoa.dataNascimento,
        dataReferencia
      )
    };
  }

  atualizar(cpf, dados, dataReferencia = new Date()) {
    const pessoa = this.pessoas.get(cpf);

    if (!pessoa) {
      throw new Error('Pessoa não encontrada');
    }

    const atualizada = {
      ...pessoa,
      ...dados,
      cpf
    };

    this.validarPessoa(atualizada);

    this.pessoas.set(cpf, atualizada);

    return {
      ...atualizada,
      idade: calcularIdade(
        atualizada.dataNascimento,
        dataReferencia
      )
    };
  }

  excluir(cpf) {
    return this.pessoas.delete(cpf);
  }

  validarPessoa({ cpf, nome, dataNascimento }) {
    if (
      typeof cpf !== 'string' ||
      !/^\d{11}$/.test(cpf)
    ) {
      throw new Error('CPF inválido');
    }

    if (
      typeof nome !== 'string' ||
      !nome.trim()
    ) {
      throw new Error('Nome inválido');
    }

    if (typeof dataNascimento !== 'string') {
      throw new Error('Data de nascimento inválida');
    }

    calcularIdade(dataNascimento);
  }
}

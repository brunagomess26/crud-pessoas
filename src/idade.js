
export function calcularIdade(dataNascimento, dataReferencia = new Date()) {
  const partes = dataNascimento.split('-').map(Number);

  if (partes.length !== 3 || partes.some(Number.isNaN)) {
    throw new Error('Data de nascimento inválida');
  }

  const [ano, mes, dia] = partes;

  const nascimento = new Date(ano, mes - 1, dia);

  if (
    nascimento.getFullYear() !== ano ||
    nascimento.getMonth() !== mes - 1 ||
    nascimento.getDate() !== dia ||
    nascimento > dataReferencia
  ) {
    throw new Error('Data de nascimento inválida');
  }

  let idade = dataReferencia.getFullYear() - ano;

  const mesAtual = dataReferencia.getMonth() + 1;
  const diaAtual = dataReferencia.getDate();

  if (
    mesAtual < mes ||
    (mesAtual === mes && diaAtual < dia)
  ) {
    idade--;
  }

  return idade;
}

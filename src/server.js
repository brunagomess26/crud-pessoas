import { criarApp } from './app.js';

const app = criarApp();
const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});

(() => {
  const chave = 'harmonia-tema';
  const raiz = document.documentElement;
  const preferencia = matchMedia('(prefers-color-scheme: dark)');

  try {
    const salvo = localStorage.getItem(chave);
    if (salvo === 'claro' || salvo === 'escuro') raiz.dataset.tema = salvo;
  } catch {}

  document.addEventListener('DOMContentLoaded', () => {
    const botao = document.querySelector('.botao-tema');
    const temaEscuro = () => raiz.dataset.tema ? raiz.dataset.tema === 'escuro' : preferencia.matches;
    const atualizar = () => {
      botao.textContent = temaEscuro() ? 'Tema claro' : 'Tema escuro';
    };

    atualizar();
    botao.hidden = false;
    preferencia.addEventListener('change', atualizar);

    botao.addEventListener('click', () => {
      raiz.dataset.tema = temaEscuro() ? 'claro' : 'escuro';
      atualizar();
      try {
        localStorage.setItem(chave, raiz.dataset.tema);
      } catch {}
    });
  });
})();

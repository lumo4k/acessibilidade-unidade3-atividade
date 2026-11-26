(() => {
  const temas = ['sistema', 'claro', 'escuro'];
  const chave = 'harmonia-tema';
  let tema = 'sistema';

  try {
    const salvo = localStorage.getItem(chave);
    if (temas.includes(salvo)) tema = salvo;
  } catch {
    tema = 'sistema';
  }

  document.documentElement.dataset.tema = tema;

  document.addEventListener('DOMContentLoaded', () => {
    const seletor = document.getElementById('tema');
    seletor.value = tema;
    seletor.closest('.controle-tema').hidden = false;
    seletor.addEventListener('change', () => {
      document.documentElement.dataset.tema = seletor.value;
      try {
        localStorage.setItem(chave, seletor.value);
      } catch {}
    });
  });
})();

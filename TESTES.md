# Atividade 5 — Cadastro e feedback acessível

## Organização

- `index.html`: home sem o formulário de contato; link para o cadastro.
- `contato.html`: cadastro completo, rótulos explícitos, instruções visíveis, agrupamentos e obrigatoriedade.
- `styles.css`: apresentação compartilhada, foco visível, estados de erro e adaptação para celular.
- `cadastro.js`: validação no blur, correção durante a digitação, mensagens associadas por aria-describedby, aria-invalid e resumo com role="alert" e links para focar os campos.
- `termos.html`: termos da demonstração, acessíveis pelo formulário.
- `.github/scripts/testar-cadastro.cjs`: testes de interação e acessibilidade.

O cadastro usa JavaScript para validação e feedback. A demonstração não envia nem armazena dados e não cria contas. O honeypot bloqueia a confirmação se preenchido; uma aplicação real também precisa validar os dados e aplicar a proteção anti-spam no servidor.

## Resultados

- html-validate 8: as três páginas passaram sem erros.
- W3C Nu: as três páginas retornaram `messages: []`.
- axe-core: nenhuma violação automática nas três páginas; o cadastro também foi verificado após mostrar erros.
- Nome completo, e-mail, CPF com dígitos verificadores, nascimento válido sem data futura e telefone opcional: passaram nos cenários de teste.
- Senha de pelo menos 8 caracteres, com maiúscula, minúscula, número e símbolo: requisitos testados individualmente.
- Confirmação de senha: divergência detectada e revalidada quando a senha original muda.
- Blur: associa mensagem ao campo e marca aria-invalid; correção remove mensagem e estado de erro, preservando as instruções.
- Envio inválido: mostra resumo no topo, recebe foco e oferece links que focam cada campo problemático.
- Teclado: campos alcançáveis com foco visível, radios pelas setas, checkbox por Espaço e envio por Enter. Honeypot fora da navegação e oculto das tecnologias assistivas.
- Cadastro válido: confirmação acessível por role="status", sem armazenamento local nem envio ao servidor.
- Honeypot preenchido: bloqueia a confirmação de cadastro válido.
- Larguras de 390 e 1280 pixels: sem rolagem horizontal.
- Nenhum erro JavaScript detectado no navegador.

## Repetir os testes

Instale as dependências utilizadas pelo workflow:

```powershell
npm install --no-save --no-package-lock html-validate@8 axe-core@4 playwright@1
npx playwright install chromium
npx html-validate@8 index.html contato.html termos.html
node .github/scripts/testar-cadastro.cjs
node .github/scripts/verificar-acessibilidade.mjs contato.html
```

Para usar um Chrome já instalado no Windows:

```powershell
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
```

O workflow verifica todas as páginas HTML e executa os testes de cadastro em alterações de HTML, CSS e JavaScript.

## NVDA — conferência manual opcional pendente

Os testes automatizados não confirmam os anúncios reais do NVDA. Para conferir:

1. Abra `contato.html` com o NVDA ativo, deixe um campo obrigatório vazio e pressione Tab. Confira o anúncio do erro.
2. Envie o formulário vazio. Confira a leitura imediata do resumo e a chegada do foco nele.
3. Use Tab e Enter nos links do resumo. Confira o foco no campo correspondente e a leitura das instruções e do erro.
4. Corrija os valores e confira a remoção de aria-invalid e da mensagem de erro.
5. Preencha todos os obrigatórios e aceite os termos. Confira o anúncio da confirmação de validação.

As páginas de catálogo e o carrinho da loja fictícia continuam fora do escopo desta atividade. Publicação e PR não foram realizados.

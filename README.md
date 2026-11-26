# Harmonia Instrumentos Musicais

Projeto da Unidade 3 de Acessibilidade da Fatec. A loja fictícia reúne um catálogo de instrumentos, uma tabela comparativa e um cadastro demonstrativo com validação acessível.

## O que foi implementado

| Branch | Implementação |
| --- | --- |
| `correcao` | Estrutura semântica com regiões da página, títulos hierárquicos, listas, tabela com legenda e cabeçalhos associados. A navegação leva a seções e páginas disponíveis no projeto. |
| `skip-link` | Atalho “Pular para o conteúdo principal” nas três páginas. O primeiro Tab revela o atalho e Enter posiciona o foco no conteúdo. |
| `prefers-color-scheme` | Paleta própria com variáveis CSS e temas claro e escuro conforme a preferência do sistema. |
| `prefers-reduced-motion` | A transição dos botões é desativada quando o sistema solicita movimento reduzido. |
| `formulario-cadastro` | Cadastro com rótulos, grupos de campos, instruções e validação ao sair do campo e ao enviar. O resumo de erros recebe foco e oferece links para corrigir cada campo. O sucesso é anunciado por uma região de status. |
| `responsividade` | Navegação com quebra de linha, grade de produtos ajustável, tabela que cabe na página e campos fluidos em telas estreitas. |
| `documentacao` | Instruções para executar, testar e publicar o projeto, além dos resultados da avaliação. |

Cada etapa foi integrada à `main` com um merge local que preserva os commits individuais.

Use o seletor **Tema** no cabeçalho para escolher **Sistema**, **Claro** ou **Escuro**. A opção **Sistema** acompanha a preferência do dispositivo. O navegador guarda a escolha para as próximas visitas.

## Como executar

Abra `index.html` no Chrome ou inicie um servidor estático na raiz do projeto.

```powershell
python -m http.server 8000
```

No navegador, acesse `http://localhost:8000/index.html`. O cadastro fica em `contato.html` e os termos ficam em `termos.html`. Use dados fictícios no cadastro. A validação ocorre no navegador, sem envio ou armazenamento pela aplicação.

## Verificação da acessibilidade

| Página | Lighthouse no Chrome |
| --- | ---: |
| Catálogo (`index.html`) | 100/100 |
| Cadastro (`contato.html`) | 100/100 |
| Termos (`termos.html`) | 100/100 |

Medição local com Lighthouse 12.8.2, categoria Acessibilidade, em 25/11/2026. O axe-core também foi executado nas três páginas nos temas claro e escuro, com zero violações detectadas. Foram verificados o foco do atalho por teclado, os destinos dos links e a ausência de rolagem horizontal na página em larguras de 320, 390, 768 e 1280 px.

Para repetir a medição, abra cada página pelo servidor local. No Chrome DevTools, selecione **Lighthouse**, marque **Accessibility** e execute a auditoria. As instruções para repetir a validação HTML e os testes automatizados do cadastro estão em [TESTES.md](TESTES.md).

## Publicação

Após enviar a `main` e as branches de cada etapa ao fork, abra **Settings → Pages**, selecione **Deploy from a branch** e escolha **main** e **/ (root)**. Use o endereço que o GitHub Pages confirmar no corpo do pull request para a branch `main` do repositório-base.

A loja partiu do [enunciado da atividade](https://github.com/pedrohenrikee/acessibilidade-unidade3-atividade). A organização visual tomou como referência a [versão Atualization](https://github.com/bryantheconnor-art/Instrumentos-Musicais-Acessibilidade-corre-o-atividade/tree/Atualization).

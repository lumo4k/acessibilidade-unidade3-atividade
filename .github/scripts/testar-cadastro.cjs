const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { readFileSync } = require('node:fs');

(async () => {
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(resolve('index.html')).href);
    assert.equal(await page.locator('form[action="/enviar"]').count(), 0);
    await page.getByRole('link', { name: 'Preencha nosso formulário de cadastro e contato' }).click();
    await page.waitForURL('**/contato.html');
    assert.equal(await page.locator('#website').isVisible(), false);
    for (const field of await page.locator('#form-cadastro input, #form-cadastro select').all()) {
      const id = await field.getAttribute('id');
      assert.equal(await page.locator(`label[for="${id}"]`).count(), 1);
    }
    await page.locator('#nome').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#nome').getAttribute('aria-invalid'), 'true');
    assert((await page.locator('#nome').getAttribute('aria-describedby')).includes('nome-erro'));
    await page.locator('#nome').fill('Maria Silva');
    assert.equal(await page.locator('#nome').getAttribute('aria-invalid'), null);
    assert.equal(await page.locator('#nome-erro').textContent(), '');
    assert.equal(await page.locator('#nome').getAttribute('aria-describedby'), 'nome-ajuda');
    await page.getByRole('button', { name: 'Validar cadastro' }).click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'resumo-erros');
    assert.equal(await page.locator('#resumo-erros a').count(), 6);
    await page.locator('#resumo-erros a[href="#cpf"]').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'cpf');
    for (const value of ['11111111111', '12345678901', '529x98224725']) {
      await page.locator('#cpf').fill(value);
      await page.locator('#cpf').blur();
      assert.equal(await page.locator('#cpf').getAttribute('aria-invalid'), 'true');
    }
    await page.locator('#cpf').fill('529.982.247-25');
    assert.equal(await page.locator('#cpf').getAttribute('aria-invalid'), null);
    await page.locator('#nascimento').fill('2999-01-01');
    assert.equal(await page.locator('#nascimento').getAttribute('aria-invalid'), 'true');
    await page.locator('#nascimento').fill('2000-02-29');
    await page.locator('#telefone').fill('123');
    await page.locator('#telefone').blur();
    assert.equal(await page.locator('#telefone').getAttribute('aria-invalid'), 'true');
    await page.locator('#telefone').fill('');
    assert.equal(await page.locator('#telefone').getAttribute('aria-invalid'), null);
    await page.locator('#email').fill('invalido');
    assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
    await page.locator('#email').fill('teste@example.com');
    for (const value of ['abc', 'abcdefgh', 'ABCDEFG1!', 'abcdefg1!', 'Abcdefgh!', 'Abcdefg1']) {
      await page.locator('#senha').fill(value);
      assert.equal(await page.locator('#senha').getAttribute('aria-invalid'), 'true');
    }
    await page.locator('#senha').fill('Teste123!');
    await page.locator('#confirmacao').fill('outra');
    assert.equal(await page.locator('#confirmacao').getAttribute('aria-invalid'), 'true');
    await page.locator('#confirmacao').fill('Teste123!');
    await page.locator('#senha').fill('Mudou123!');
    assert.equal(await page.locator('#confirmacao').getAttribute('aria-invalid'), 'true');
    await page.locator('#confirmacao').fill('Mudou123!');
    await page.locator('#termos').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#termos').getAttribute('aria-invalid'), null);
    assert.equal(await page.locator('#resumo-erros a').count(), 0);
    await page.locator('#genero-feminino').focus();
    await page.keyboard.press('ArrowDown');
    assert(await page.locator('#genero-masculino').isChecked());
    await page.locator('#interesse-guitarras').focus();
    await page.keyboard.press('Space');
    assert(await page.locator('#interesse-guitarras').isChecked());
    await page.locator('#origem').selectOption('indicacao');
    await page.getByRole('button', { name: 'Validar cadastro' }).focus();
    await page.keyboard.press('Enter');
    assert((await page.locator('#resultado-cadastro').textContent()).includes('validado com sucesso'));
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    await page.locator('#website').evaluate(el => { el.value = 'spam'; });
    await page.getByRole('button', { name: 'Validar cadastro' }).click();
    assert((await page.locator('#resumo-erros').textContent()).includes('Não foi possível'));
    assert.equal(await page.locator('#resultado-cadastro').textContent(), '');
    await page.reload();
    const visited = new Set();
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => ({ id: document.activeElement.id, tag: document.activeElement.tagName, outline: getComputedStyle(document.activeElement).outlineStyle }));
      if (focused.tag === 'BODY') break;
      assert.notEqual(focused.outline, 'none', `Foco invisível: ${JSON.stringify(focused)}`);
      visited.add(focused.id);
    }
    for (const id of ['nome', 'email', 'cpf', 'nascimento', 'telefone', 'senha', 'confirmacao', 'origem', 'termos']) assert(visited.has(id));
    assert(!visited.has('website'));
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.addScriptTag({ content: readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8') });
    const axe = () => page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
    assert.deepEqual((await axe()).violations.map(v => v.id), []);
    await page.getByRole('button', { name: 'Validar cadastro' }).click();
    assert.deepEqual((await axe()).violations.map(v => v.id), []);
    assert.deepEqual(errors, []);
    console.log('PASSOU: navegação, labels, blur, correção em tempo real, CPF, data, telefone, senha, confirmação, resumo e âncoras, teclado, honeypot, sucesso sem persistência, mobile e axe nos estados inicial e inválido.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

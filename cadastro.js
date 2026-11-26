'use strict';

const form = document.getElementById('form-cadastro');
const summary = document.getElementById('resumo-erros');
const result = document.getElementById('resultado-cadastro');
const fields = ['nome', 'email', 'cpf', 'nascimento', 'telefone', 'senha', 'confirmacao', 'termos']
  .map(id => document.getElementById(id));
const touched = new Set();
let submitted = false;

// O honeypot não participa da ordem de Tab nem da árvore de acessibilidade.
function validCPF(value) {
  if (!/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  if (/^(\d)\1{10}$/.test(digits)) return false;
  for (let length = 9; length <= 10; length++) {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(digits[i]) * (length + 1 - i);
    const check = (sum * 10) % 11;
    if ((check === 10 ? 0 : check) !== Number(digits[length])) return false;
  }
  return true;
}

function errorFor(field) {
  const value = field.value.trim();
  if (field.id === 'termos') return field.checked ? '' : 'Aceite os termos de uso para continuar.';
  if (field.required && !value) {
    return {
      nome: 'Informe seu nome completo, incluindo o sobrenome.',
      email: 'Informe seu e-mail no formato nome@exemplo.com.',
      cpf: 'Informe seu CPF com 11 números.',
      nascimento: 'Informe uma data de nascimento válida.',
      senha: 'Crie uma senha seguindo os requisitos indicados.',
      confirmacao: 'Repita a senha no campo Confirmação de senha.'
    }[field.id];
  }
  switch (field.id) {
    case 'nome':
      return value.split(/\s+/).length < 2 ? 'Informe nome e sobrenome separados por espaço.' : '';
    case 'email':
      return field.validity.typeMismatch ? 'Informe um e-mail válido, como nome@exemplo.com.' : '';
    case 'cpf':
      return validCPF(value) ? '' : 'CPF inválido. Confira os 11 números e os dígitos verificadores.';
    case 'nascimento': {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(0);
      date.setFullYear(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !year || year < 1 || date.getFullYear() !== year || date.getMonth() !== month - 1 ||
        date.getDate() !== day || date > today ? 'Informe uma data de nascimento válida, que não esteja no futuro.' : '';
    }
    case 'telefone':
      return value && (!/^[\d\s()+-]+$/.test(value) || !/^\d{10,11}$/.test(value.replace(/\D/g, '')))
        ? 'Informe DDD e telefone com 10 ou 11 números, ou deixe o campo vazio.' : '';
    case 'senha':
      return field.value.length < 8 || !/[A-Z]/.test(field.value) || !/[a-z]/.test(field.value) ||
        !/\d/.test(field.value) || !/[^\w\s]/.test(field.value)
        ? 'A senha precisa de 8 caracteres ou mais, maiúscula, minúscula, número e símbolo.' : '';
    case 'confirmacao':
      return field.value === document.getElementById('senha').value ? '' : 'As senhas não coincidem. Repita a mesma senha nos dois campos.';
    default: return '';
  }
}

function validate(field) {
  const message = errorFor(field);
  const error = document.getElementById(`${field.id}-erro`);
  const descriptions = new Set((field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  if (message) {
    field.setAttribute('aria-invalid', 'true');
    descriptions.add(error.id);
  } else {
    field.removeAttribute('aria-invalid');
    descriptions.delete(error.id);
  }
  error.textContent = message;
  if (descriptions.size) field.setAttribute('aria-describedby', [...descriptions].join(' '));
  else field.removeAttribute('aria-describedby');
  return !message;
}

function updateSummary(focus = false) {
  summary.replaceChildren();
  const invalid = fields.filter(field => field.getAttribute('aria-invalid') === 'true');
  if (!invalid.length) return;
  const heading = document.createElement('h2');
  heading.textContent = `Revise ${invalid.length} ${invalid.length === 1 ? 'campo' : 'campos'} para continuar`;
  const list = document.createElement('ul');
  for (const field of invalid) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${field.id}`;
    link.textContent = document.getElementById(`${field.id}-erro`).textContent;
    link.addEventListener('click', event => {
      event.preventDefault();
      field.focus();
    });
    item.append(link);
    list.append(item);
  }
  summary.append(heading, list);
  if (focus) summary.focus();
}

for (const field of fields) {
  field.addEventListener('blur', () => {
    touched.add(field.id);
    validate(field);
    if (submitted) updateSummary();
  });
  field.addEventListener('input', () => {
    result.textContent = '';
    if (touched.has(field.id) || submitted) validate(field);
    if (field.id === 'senha' && (touched.has('confirmacao') || submitted)) {
      validate(document.getElementById('confirmacao'));
    }
    if (submitted) updateSummary();
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  submitted = true;
  result.textContent = '';
  if (document.getElementById('website').value) {
    summary.textContent = 'Não foi possível validar este cadastro. Recarregue a página e tente novamente.';
    summary.focus();
    return;
  }
  const valid = fields.map(validate).every(Boolean);
  updateSummary(!valid);
  if (valid) result.textContent = 'Cadastro validado com sucesso. Esta é uma demonstração: nenhum dado foi enviado ou armazenado.';
});

form.noValidate = true;
form.querySelector('button[type="submit"]').disabled = false;

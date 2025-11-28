// register.js
const API_URL = "http://localhost:3001/api/user"; // ajuste se sua rota for diferente

// pegar elementos POR ID (devem existir no HTML)
const nameInput = document.getElementById("cadName");
const emailInput = document.getElementById("cadEmail");
const passwordInput = document.getElementById("cadPassword");
const form = document.getElementById("formCadastro");
const btn = document.getElementById("btnCadastro");
const role = "user";

// função para buscar (GET) — sem body
async function buscaUsuario() {
  try {
    const response = await fetch(API_URL, { method: "GET", headers: { "Content-Type": "application/json" } });
    if (!response.ok) {
      console.warn("buscaUsuario: resposta não OK", response.status);
      return;
    }
    const data = await response.json();
    console.log("Usuários encontrados:", data);
    return data;
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
  }
}

// handler do submit do form (mais robusto que click no botão)
form.addEventListener("submit", function (e) {
  e.preventDefault(); // ESSENCIAL para evitar refresh/redirect
  // validações simples
  const nome = nameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  if (!nome || !email || !pass) {
    alert("Por favor, preencha todos os campos para continuar.");
    return;
  }

  const novoUsuario = {
    name: nome,
    email: email,
    password: pass,
    role: role,
  };

  insertUser(novoUsuario);
});

// função para inserir usuário (POST)
async function insertUser(usuario) {
  try {
    btn.disabled = true;
    btn.textContent = "Cadastrando...";

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    };

    const response = await fetch(API_URL, requestOptions);

    if (!response.ok) {
      const texto = await response.text();
      console.error("Erro do servidor:", response.status, texto);
      alert("Ops! Não foi possível realizar o cadastro. Tente novamente.");
      return;
    }

    // parse do body — se o servidor não retornar JSON, trate diferente
    const result = await response.json();
    console.log("Resposta do servidor:", result);
    alert("Cadastro realizado com sucesso! Bem-vindo(a)!");
    form.reset();
  } catch (err) {
    console.error("Falha na requisição:", err);
    alert("Ops! Problema de conexão. Verifique sua internet.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Cadastrar";
  }
}

// chamada opcional para carregar lista (apenas para debug)
buscaUsuario();

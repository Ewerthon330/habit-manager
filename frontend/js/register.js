// register.js
const API_URL = "http://localhost:3000/api/user";
// caminho da página de login — ajuste se necessário
const LOGIN_PAGE = "login.html"; // ex: "../pages/login.html" ou "/login.html"

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
      console.warn("[REGISTER] Erro ao buscar usuários:", response.status);
      return;
    }
    const data = await response.json();
    console.log("[REGISTER] Lista de usuários carregada.");
    return data;
  } catch (err) {
    console.error("[REGISTER] Falha na comunicação com o servidor:", err);
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

  if (pass.length < 6) {
    alert("A senha deve ter no mínimo 6 caracteres.");
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
      let errorMessage = "Ops! Não foi possível realizar o cadastro. Tente novamente.";
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch (e) {
        const texto = await response.text();
        console.error("Erro do servidor:", response.status, texto);
      }
      alert(errorMessage);
      return;
    }

    // parse do body — se o servidor não retornar JSON, trate diferente
    let result;
    try {
      result = await response.json();
    } catch (err) {
      // resposta não é JSON — cria um fallback simples
      result = { user: { name: usuario.name, email: usuario.email } };
    }

    // Normalizar: preferir result.user, senão result
    const createdUser = result.user ?? result ?? { name: usuario.name, email: usuario.email };

    // SALVAR no localStorage para Home ler depois
    try {
      localStorage.setItem("currentUser", JSON.stringify(createdUser));
    } catch (err) {
      console.warn("Não foi possível salvar currentUser no localStorage:", err);
    }

    console.log("Resposta do servidor:", result);
    alert("Cadastro realizado com sucesso! Bem-vindo(a)!");
    form.reset();

    // === AQUI: reativa botão e redireciona para a página de login ===
    // Reativamos o botão antes de navegar (opcional, navegacao normalmente interrompe execução)
    btn.disabled = false;
    btn.textContent = "Cadastrar";

    // Redireciona imediatamente para a página de login configurada
    window.location.href = LOGIN_PAGE;

  } catch (err) {
    console.error("Falha na requisição:", err);
    alert("Ops! Problema de conexão. Verifique sua internet.");
  } finally {
    // garantia de fallback: se por algum motivo não redirecionou, reativa o botão
    if (!btn) return;
    btn.disabled = false;
    btn.textContent = "Cadastrar";
  }
}

export function nameHome() {
  const nome = nameInput.value.trim();

  if (!nome) {
    alert("")
    return;
  }
}

// chamada opcional para carregar lista (apenas para debug)
buscaUsuario();

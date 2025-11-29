// login.js
const API_URL = "http://localhost:3000/api/auth/login";

const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const formLogin = document.getElementById("sign");
const btnLogin = document.getElementById("btnLogin");

// Mesma função usada no cadastro (proteção caso btnLogin seja null)
function setLoading(isLoading) {
  if (!btnLogin) return;
  btnLogin.disabled = isLoading;
  btnLogin.textContent = isLoading ? "Entrando..." : "Entrar";
}

// checagem rápida: evita erro se elementos não forem encontrados
if (!formLogin) {
  console.error("[LOGIN] Formulário de login não encontrado.");
} else if (!emailInput || !passwordInput) {
  console.error("[LOGIN] Campos de email ou senha não identificados.");
} else {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    if (!credentials.email || !credentials.password) {
      alert("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      // tentar parsear JSON com segurança
      let data = {};
      try {
        data = await response.json();
      } catch (parseErr) {
        console.warn("[LOGIN] Resposta do servidor não é JSON válido:", parseErr);
      }

      if (!response.ok) {
        alert((data && data.message) || "Credenciais inválidas. Verifique e tente novamente.");
        setLoading(false);
        return;
      }

      // Se sua API retornar token e usuário, salve em sessionStorage
      if (data && data.token) {
        try { sessionStorage.setItem("authToken", data.token); } catch (err) { console.warn(err); }
      }
      if (data && data.user) {
        try { sessionStorage.setItem("user", JSON.stringify(data.user)); } catch (err) { console.warn(err); }
      }

      // Redireciona após login
      window.location.href = "home.html";

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Ops! Não conseguimos conectar ao servidor. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  });
}

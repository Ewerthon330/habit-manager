// login.js (ajustado — mantém sua estrutura)
const API_URL = "http://localhost:3001/api/auth/login"; // corrigido para /api/auth/login

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
  console.error("Form de login não encontrado (id='sign'). O script não pode ser executado.");
} else if (!emailInput || !passwordInput) {
  console.error("Inputs de email/senha não encontrados (ids: 'loginEmail' e 'loginPassword').");
} else {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    const credentials = {
      email: emailInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    console.log("FRONT: enviando credentials:", credentials);

    if (!credentials.email || !credentials.password) {
      alert("Preencha email e senha.");
      setLoading(false);
      return;
    }

    // CORREÇÃO: usar as variáveis corretas (emailInput.value / passwordInput.value)
    console.log("ENVIANDO PARA O BACK:", {
      email: emailInput.value.trim(),
      password: passwordInput.value ? "*****" : "",
    });

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
        // resposta não JSON — manter data vazio e logar para debug
        console.warn("Resposta do servidor não é JSON:", parseErr);
      }

      // CORREÇÃO: agora que 'data' existe, podemos logá-lo
      console.log("RESPOSTA DO BACK:", data);
      console.log("Resposta do login:", response.status, data);

      if (!response.ok) {
        alert((data && data.message) || "Ops! E-mail ou senha incorretos. Tente novamente.");
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

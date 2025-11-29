import { auth, provider } from './firebase.js';
import { signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const API_URL = 'http://localhost:3000/api/auth/google-signup';

export async function handleGoogleAuth() {
    try {
        console.log("[GOOGLE AUTH] Iniciando autenticação...");

        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Obter o ID Token do Firebase
        const idToken = await user.getIdToken();

        console.log("[GOOGLE AUTH] Usuário autenticado no Firebase:", user.email);

        // Enviar ID Token para o backend verificar
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("[GOOGLE AUTH] Login verificado com sucesso.");

            // Salvar sessão
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));

            // Redirecionar
            window.location.href = 'home.html';
        } else {
            throw new Error(data.message || 'Falha na verificação do backend');
        }

    } catch (error) {
        console.error("❌ Erro na autenticação Google:", error);

        if (error.code === 'auth/popup-closed-by-user') {
            alert('Login cancelado.');
        } else {
            alert('Erro ao entrar com Google: ' + error.message);
        }
    }
}

// Auto-bind se o botão existir
document.addEventListener('DOMContentLoaded', () => {
    const btnLogin = document.getElementById('googleLoginBtn');
    const btnRegister = document.getElementById('btnGoogle');

    const btn = btnLogin || btnRegister;

    if (btn) {
        btn.addEventListener('click', handleGoogleAuth);
        console.log("✅ Botão Google vinculado");
    }
});

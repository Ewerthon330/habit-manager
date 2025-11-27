// app.js (module)
import { auth, provider } from "./firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged, getIdToken } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnToken = document.getElementById('btn-token');

const notSigned = document.getElementById('not-signed');
const signed = document.getElementById('signed');
const avatar = document.getElementById('avatar');
const userInfo = document.getElementById('user-info');
const tokenArea = document.getElementById('token-area');

btnLogin.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // result.user está autenticado
    console.log('Login bem-sucedido', result.user);
  } catch (err) {
    console.error('Erro no login:', err);
    alert('Erro no login: ' + (err.message || err));
  }
});

btnLogout.addEventListener('click', async () => {
  await signOut(auth);
});

btnToken.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) { tokenArea.style.display = 'none'; return; }
  tokenArea.style.display = 'block';
  tokenArea.textContent = 'Carregando token...';
  try {
    const idToken = await getIdToken(user, /* forceRefresh */ false);
    // Se você for enviar ao backend, envie como Authorization Bearer <idToken> ou no body.
    tokenArea.textContent = idToken;
  } catch (err) {
    tokenArea.textContent = 'Erro ao obter token: ' + err.message;
  }
});

// Observador de estado de autenticação
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário logado
    notSigned.style.display = 'none';
    signed.style.display = 'flex';
    avatar.src = user.photoURL || '';
    userInfo.innerHTML = `<strong>${user.displayName || ''}</strong><br/><small>${user.email || ''}</small>`;
    tokenArea.style.display = 'none';
  } else {
    // Deslogado
    notSigned.style.display = 'flex';
    signed.style.display = 'none';
    avatar.src = '';
    userInfo.innerHTML = '';
    tokenArea.style.display = 'none';
  }
});

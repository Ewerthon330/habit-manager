const API_URL = "http://localhost:3000/api/user";
const name = document.getElementById("txtNome");
const email = document.getElementById("txtEmail");
const password = document.getElementById("txtPass");
const role = "user";
const usuarioList = {};
const btn = document.querySelector("#btnCadastro");

const requestOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(),
};

async function buscaUsuario() {
  const response = await fetch(API_URL, requestOptions);
  const data = await response.json();
  console.log(data);
}

btn.addEventListener("click", function (e) {
  e.preventDefault();
  const novoUsuario = {
    name: name.value,
    email: email.value,
    password: password.value,
    role: role,
  };
  insertUser(novoUsuario);
});

async function insertUser(usuarioList) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioList),
  };
  const response = await fetch(API_URL, requestOptions);
  console.log(response.data);
}

buscaUsuario();

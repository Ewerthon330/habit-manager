# **Gestor de Hábitos com Chatbot (Health Time)**

Projeto desenvolvido para auxiliar usuários a gerenciar e acompanhar seus hábitos diários, com foco em saúde e produtividade. O sistema conta com um **Chatbot Inteligente (HabiBot)** integrado para oferecer motivação e dicas personalizadas.

---

## 📌 Funcionalidades

- **Gestão de Hábitos**:
  - Cadastro de novos hábitos personalizados.
  - Visualização de progresso semanal.
  - Marcação de hábitos como concluídos (com persistência de dados).
  - Remoção de hábitos.
- **Autenticação Segura**:
  - Login e Cadastro com E-mail e Senha.
  - **Login com Google** integrado.
- **Chatbot Inteligente (HabiBot)**:
  - Assistente virtual focado em saúde e rotina.
  - Respostas geradas via **Google Gemini API**.
  - Personalidade motivadora e prática.
- **Interface Responsiva**:
  - Design moderno e fluido.
  - Otimizado para dispositivos móveis (incluindo telas pequenas como iPhone SE e Galaxy S20).

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Firebase Authentication** (Client SDK)

### Backend
- **Node.js & Express**
- **TypeScript**
- **Firebase Admin SDK** (Firestore & Auth)
- **Google Gemini API** (via `generativelanguage`)

---

## 📁 Estrutura do Projeto

```
habit-manager/
│
├── backend/                # Servidor Node.js/Express
│   ├── src/
│   │   ├── controllers/    # Lógica de negócios (Auth, Chat, Habits)
│   │   ├── routes/         # Rotas da API
│   │   ├── models/         # Modelos de dados
│   │   └── ...
│   ├── .env                # Variáveis de ambiente (NÃO COMITAR)
│   └── package.json
│
├── frontend/               # Interface do Usuário
│   ├── css/                # Estilos globais e específicos
│   ├── js/                 # Lógica do frontend
│   ├── pages/              # Páginas HTML (Login, Home, etc.)
│   └── index.html          # Ponto de entrada
│
└── README.md
```

---

## 🚀 Como Rodar o Projeto

### 1. Configuração do Backend
1.  Entre na pasta `backend`:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` na raiz do `backend` com as seguintes chaves (baseado no `.env.example`):
    ```env
    PORT=3001
    FIREBASE_PROJECT_ID=seu-project-id
    FIREBASE_CLIENT_EMAIL=seu-client-email
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    GEMINI_API_KEY=sua-chave-gemini
    ```
4.  Inicie o servidor:
    ```bash
    npm run dev
    ```

### 2. Executando o Frontend
1.  Basta abrir o arquivo `frontend/index.html` (ou `frontend/pages/login.html`) no seu navegador.
2.  Certifique-se de que o backend está rodando na porta `3001`.

---

## 👥 Integrantes

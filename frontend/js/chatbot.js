const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
// API Key removida por segurança (agora no backend)

// Histórico começa vazio (System Prompt é injetado no backend)
let chatHistory = [];

const addToHistory = (role, text) => {
    chatHistory.push({
        role: role,
        parts: [{ text: text }]
    });
};

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async (incomingChatDiv) => {
    // Agora aponta para o nosso backend, sem expor a chave API
    const API_URL = "http://localhost:3001/api/chat";
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: chatHistory
        })
    }

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        const apiResponseText = data.candidates[0].content.parts[0].text.trim();

        let formattedText = apiResponseText.replace(/\*\*(.*?)\*\*/g, '$1');

        pElement.innerText = formattedText;

        addToHistory("model", apiResponseText);

    } catch (error) {
        console.log(error);
        pElement.classList.add("error");
        pElement.textContent = "Ops! Tive um problema. Verifique sua chave de API ou tente novamente.";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <div class="bot-avatar-small">🤖</div>
                    <div class="typing-animation">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = "auto";

    const html = `<div class="chat-content">
                <div class="chat-details">
                    <p>${userText}</p>
                </div>
            </div>`;

    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    addToHistory("user", userText);

    setTimeout(showTypingAnimation, 500);
};

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

sendButton.addEventListener("click", handleOutgoingChat);

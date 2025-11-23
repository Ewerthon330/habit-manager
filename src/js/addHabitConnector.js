// Arquivo: ../js/addHabitConnector.js

// Define o limite máximo de hábitos que o usuário pode ter
const MAX_HABITS = 6;

// Função para ler o número total de hábitos (salvos + pendentes)
function getHabitCount() {
    // 1. Tenta ler a lista de hábitos SALVOS (do script.js principal)
    const habitsJson = localStorage.getItem('habits');
    let savedCount = 0;

    if (habitsJson) {
        try {
            savedCount = JSON.parse(habitsJson).length;
        } catch (e) {
            // Ignora se o JSON estiver inválido, assume 0
        }
    }

    // 2. Adiciona o número de hábitos PENDENTES (que estão no processo de adição)
    const pendingHabitsJson = localStorage.getItem('pendingHabits');
    const pendingCount = pendingHabitsJson ? JSON.parse(pendingHabitsJson).length : 0;
        
    return savedCount + pendingCount;
}


document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('addHabitSubmit');

    if (submitButton) {
        submitButton.addEventListener('click', handleAddHabitSubmit);
    }
});

function handleAddHabitSubmit() {
    // 1. Verificar se o limite já foi atingido
    if (getHabitCount() >= MAX_HABITS) {
        alert(`Limite atingido! Você pode ter no máximo ${MAX_HABITS} hábitos ativos.`);
        return; // Impede a adição
    }

    // 2. Obter os valores
    const nameInput = document.getElementById('habitNameInput');
    const colorInput = document.getElementById('habitColorInput');

    const name = nameInput.value.trim();
    const color = colorInput.value.trim().toUpperCase();

    // Validação
    if (name === "") {
        alert("O nome do hábito não pode estar vazio.");
        return;
    }
    
    // 3. Preparar e salvar os dados no LocalStorage
    const newHabitData = {
        name: name,
        color: color
    };
    
    try {
        const pendingHabitsJson = localStorage.getItem('pendingHabits');
        const pendingHabits = pendingHabitsJson ? JSON.parse(pendingHabitsJson) : [];
        
        pendingHabits.push(newHabitData);
        localStorage.setItem('pendingHabits', JSON.stringify(pendingHabits));
        
        // 4. Redirecionar para a tela principal
        window.location.href = 'home.html';

    } catch (e) {
        console.error("Erro ao salvar o hábito no LocalStorage:", e);
        alert("Erro ao adicionar o hábito. Tente novamente.");
    }
}
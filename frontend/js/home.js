// --- CONFIGURAÇÃO DA API ---
const API_BASE_URL = "http://localhost:3001/api/habit";

// --- ESTADO GLOBAL ---
let habits = []; // Array de hábitos vindos do backend
let currentUser = null;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    updateGreeting();
    await loadHabits();
    renderApp();
});

// --- AUTENTICAÇÃO E USUÁRIO ---
function checkAuth() {
    const userJson = sessionStorage.getItem('user');
    if (!userJson) {
        window.location.href = 'login.html';
        return;
    }
    try {
        currentUser = JSON.parse(userJson);
    } catch (e) {
        console.error("Erro ao parsear usuário:", e);
        window.location.href = 'login.html';
    }
}

function updateGreeting() {
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl && currentUser) {
        // Pega o primeiro nome
        const firstName = currentUser.name.split(' ')[0];
        greetingEl.textContent = `Hello, ${firstName}`;
    }
}

// --- INTEGRAÇÃO COM BACKEND ---

async function loadHabits() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id || currentUser.uid}/habits`);
        if (!response.ok) throw new Error('Falha ao buscar hábitos');

        habits = await response.json();
        console.log("Hábitos carregados:", habits);
    } catch (error) {
        console.error("Erro ao carregar hábitos:", error);
        alert("Ops! Não conseguimos carregar seus hábitos. Verifique sua conexão.");
    }
}

// Função chamada pelo add-habit.html (precisaremos refatorar add-habit.js também, 
// mas por enquanto vamos focar em exibir e manipular na home)
// NOTA: O add-habit.js atual salva no localStorage 'pendingHabits'. 
// Vamos manter a lógica de checar 'pendingHabits' e enviar para o backend.

async function checkAndAddNewHabits() {
    const pendingHabitsJson = localStorage.getItem('pendingHabits');

    if (pendingHabitsJson) {
        try {
            const pendingHabits = JSON.parse(pendingHabitsJson);

            for (const habitData of pendingHabits) {
                await createHabitAPI(habitData.name, habitData.color);
            }

            localStorage.removeItem('pendingHabits');
            await loadHabits(); // Recarrega do servidor
            renderApp();

        } catch (e) {
            console.error("Erro ao processar hábitos pendentes:", e);
        }
    }
}

async function createHabitAPI(name, color) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id || currentUser.uid}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, color }) // Backend precisa aceitar color se quisermos salvar
        });

        if (!response.ok) throw new Error('Erro ao criar hábito');
        return await response.json();
    } catch (error) {
        console.error("Erro ao criar hábito:", error);
    }
}

async function deleteHabit(habitId) {
    if (!confirm("Tem certeza que deseja excluir este hábito permanentemente?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id || currentUser.uid}/habits/${habitId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir hábito');

        // Atualiza localmente e re-renderiza
        habits = habits.filter(h => h.id !== habitId);
        renderApp();
        alert("Pronto! Hábito removido.");

    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Ops! Não foi possível excluir o hábito. Tente novamente.");
    }
}

async function editHabit(habitId) {
    // Backend atual não tem rota de edição de nome, apenas toggle.
    // Implementação futura.
    alert("Em breve! A edição de hábitos estará disponível nas próximas atualizações.");
}

async function setCompletion(habitId, dateKey, isCompleted) {
    // Otimista: atualiza interface antes
    updateLocalCompletion(habitId, dateKey, isCompleted);
    renderApp();

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id || currentUser.uid}/habits/${habitId}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: dateKey, completed: isCompleted })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar status');
        }
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        // Reverte em caso de erro
        updateLocalCompletion(habitId, dateKey, !isCompleted);
        renderApp();
        alert("Ops! Não conseguimos salvar o status. Tente novamente.");
    }
}

function updateLocalCompletion(habitId, dateKey, isCompleted) {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
        if (!habit.completedDates) habit.completedDates = {};
        habit.completedDates[dateKey] = isCompleted;
    }
}

function toggleCompletion(habitId, dateKey) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const currentStatus = habit.completedDates && habit.completedDates[dateKey];
    setCompletion(habitId, dateKey, !currentStatus);
}


// --- UTILITÁRIOS DE DATA ---
const today = new Date();
let currentWeekStart = getStartOfWeek(today);

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
    return date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' });
}

// --- RENDERIZAÇÃO ---

function renderApp() {
    // Verifica se há novos hábitos do add-habit.js antes de renderizar
    checkAndAddNewHabits().then(() => {
        renderHabitGrid();
        renderDailyGoals();
    });
}

function renderHabitGrid() {
    const container = document.getElementById('habit-rows');
    const tempContainer = document.createElement('div');

    if (habits.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / span 9; text-align: center; margin-top: 20px; color: var(--color-text-secondary);">Adicione seu primeiro hábito para começar a rastrear!</div>';
        return;
    }

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    tempContainer.style.display = 'contents';

    habits.forEach(habit => {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'habit-name';
        nameDiv.textContent = habit.name;
        tempContainer.appendChild(nameDiv);

        let completedCount = 0;

        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + i);
            const dateKey = formatDateKey(date);

            const isChecked = habit.completedDates && habit.completedDates[dateKey];

            if (isChecked) {
                completedCount++;
            }

            const cell = document.createElement('div');
            cell.className = `grid-cell ${isChecked ? 'checked' : ''}`;
            // Backend ainda não salva cor, usando padrão ou aleatória se quiser
            if (isChecked) {
                cell.style.setProperty('--habit-color', habit.color || '#4CAF50');
            }

            cell.onclick = () => toggleCompletion(habit.id, dateKey);

            tempContainer.appendChild(cell);
        }

        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-column';
        statsDiv.textContent = `${completedCount}/7`;
        tempContainer.appendChild(statsDiv);
    });

    container.innerHTML = tempContainer.innerHTML;

    document.getElementById('current-week-range').textContent =
        `${formatDisplayDate(currentWeekStart).split(',')[1]} - ${formatDisplayDate(currentWeekEnd).split(',')[1]}`;
}

function renderDailyGoals() {
    const container = document.getElementById('daily-goals-list');
    container.innerHTML = '';

    const todayKey = formatDateKey(today);
    let completedGoals = 0;

    if (habits.length === 0) {
        container.innerHTML = '<p class="placeholder">Nenhum hábito para hoje. Adicione um!</p>';
        updateDailyProgress(0);
        return;
    }

    habits.forEach(habit => {
        const isCompleted = habit.completedDates && habit.completedDates[todayKey];
        if (isCompleted) {
            completedGoals++;
        }

        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${isCompleted ? 'completed' : 'pending'}`;
        goalItem.style.setProperty('--habit-color', habit.color || '#4CAF50');

        goalItem.innerHTML = `
            <h3>${habit.name}</h3>
            ${isCompleted ?
                `<div class="goal-buttons">
                    <span class="status">✅ Concluído</span>
                    <button class="undo-button" onclick="setCompletion('${habit.id}', '${todayKey}', false)">Desfazer</button>
                </div>`
                :
                `<button class="mark-complete-button" onclick="setCompletion('${habit.id}', '${todayKey}', true)">Marcar Completo</button>`
            }
            
            <div class="habit-actions-menu">
                <span class="menu-dots" onclick="this.nextElementSibling.classList.toggle('open')">⋮</span>
                <div class="dropdown-content">
                    <a href="javascript:void(0)" onclick="editHabit('${habit.id}'); this.parentNode.classList.remove('open');">Alterar</a>
                    <a href="javascript:void(0)" onclick="deleteHabit('${habit.id}'); this.parentNode.classList.remove('open');">Excluir</a>
                </div>
            </div>
        `;
        container.appendChild(goalItem);
    });

    updateDailyProgress(completedGoals);
}

function updateDailyProgress(completedCount) {
    const totalHabits = habits.length;
    const percent = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    document.getElementById('daily-progress-fill').style.width = `${percent}%`;
    document.getElementById('daily-progress-text').textContent = `${percent}% do objetivo diário alcançado`;
    document.getElementById('today-date').textContent = today.toLocaleDateString('pt-BR', { weekday: 'short', month: 'numeric', day: 'numeric' });
}

// --- CONTROLE DE EVENTOS (NAVEGAÇÃO SEMANAL) ---
document.getElementById('prev-week').addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderApp(); // Apenas re-renderiza, não precisa buscar do backend de novo se já temos tudo
});

document.getElementById('next-week').addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderApp();
});

// Expor funções para o escopo global (para os onlick no HTML)
window.setCompletion = setCompletion;
window.editHabit = editHabit;
window.deleteHabit = deleteHabit;
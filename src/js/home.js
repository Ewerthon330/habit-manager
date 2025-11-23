// --- MODELO DE DADOS ---
let habits = []; // { id: 'uuid', name: 'Ler', color: '#FFB347' }
let records = {}; // { 'habitId': { 'YYYY-MM-DD': true/false, ... } }

const today = new Date();
let currentWeekStart = getStartOfWeek(today); 

// --- FUNÇÕES DE PERSISTÊNCIA DE ESTADO ---

function saveState() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('records', JSON.stringify(records));
}

function loadState() {
    const habitsJson = localStorage.getItem('habits');
    const recordsJson = localStorage.getItem('records');
    
    if (habitsJson) {
        habits = JSON.parse(habitsJson);
    }
    if (recordsJson) {
        records = JSON.parse(recordsJson);
    }
}

// --- FUNÇÕES DE UTILIDADE DE DATA ---

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

// --- FUNÇÕES DE CRUD DO HÁBITO (Alterar e Excluir) ---

function addHabit(name, color) {
    const newHabit = {
        id: crypto.randomUUID(), 
        name: name,
        color: color
    };
    habits.push(newHabit);
    records[newHabit.id] = {}; 
    saveState();
}

function deleteHabit(habitId) {
    if (confirm("Tem certeza que deseja excluir este hábito permanentemente?")) {
        // Remove do array de hábitos
        habits = habits.filter(h => h.id !== habitId);
        
        // Remove do objeto de registros
        if (records[habitId]) {
            delete records[habitId];
        }
        
        renderApp();
        alert("Hábito excluído com sucesso!");
    }
}

function editHabit(habitId) {
    const habitToEdit = habits.find(h => h.id === habitId);
    if (!habitToEdit) return;

    // Simples: Usa prompt para editar o nome do hábito
    const newName = prompt(`Digite o novo nome para "${habitToEdit.name}":`, habitToEdit.name);
    
    if (newName && newName.trim() !== habitToEdit.name) {
        habitToEdit.name = newName.trim();
        renderApp();
        alert(`Hábito "${newName}" atualizado com sucesso!`);
    } else if (newName === null) {
        // Usuário cancelou
        return;
    }
}


function setCompletion(habitId, dateKey, isCompleted) {
    if (!records[habitId]) {
        records[habitId] = {};
    }
    records[habitId][dateKey] = isCompleted;
    renderApp(); 
}

function toggleCompletion(habitId, dateKey) {
    if (!records[habitId]) {
        records[habitId] = {};
    }
    records[habitId][dateKey] = !records[habitId][dateKey];
    renderApp(); 
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---

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
            
            const isChecked = records[habit.id] && records[habit.id][dateKey];
            
            if (isChecked) {
                completedCount++;
            }
            
            const cell = document.createElement('div');
            cell.className = `grid-cell ${isChecked ? 'checked' : ''}`;
            if (isChecked) {
                cell.style.setProperty('--habit-color', habit.color);
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
        const isCompleted = records[habit.id] && records[habit.id][todayKey];
        if (isCompleted) {
            completedGoals++;
        }
        
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${isCompleted ? 'completed' : 'pending'}`;
        goalItem.style.setProperty('--habit-color', habit.color);
        
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

// --- RECEPTOR DE NOVOS HÁBITOS ---
function checkAndAddNewHabits() {
    const pendingHabitsJson = localStorage.getItem('pendingHabits');
    
    if (pendingHabitsJson) {
        try {
            const pendingHabits = JSON.parse(pendingHabitsJson);
            
            pendingHabits.forEach(data => {
                addHabit(data.name, data.color); 
            });
            
            localStorage.removeItem('pendingHabits');
            
        } catch (e) {
            console.error("Erro ao carregar hábitos pendentes:", e);
        }
    }
}

// --- INICIALIZAÇÃO E RENDERIZAÇÃO PRINCIPAL ---

function renderApp() {
    renderHabitGrid();
    renderDailyGoals();
    saveState(); 
}

document.addEventListener('DOMContentLoaded', () => {
    loadState(); 
    checkAndAddNewHabits();
    renderApp(); 
});

// --- CONTROLE DE EVENTOS (NAVEGAÇÃO SEMANAL) ---
document.getElementById('prev-week').addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderApp();
});

document.getElementById('next-week').addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderApp();
});
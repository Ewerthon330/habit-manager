// home.js (completado)
// --- MODELO DE DADOS ---
let habits = []; // { id: 'uuid', name: 'Ler', color: '#FFB347' }
let records = {}; // { 'habitId': { 'YYYY-MM-DD': true/false, ... } }

const today = new Date();
let currentWeekStart = getStartOfWeek(today);

// --- FUNÇÕES DE PERSISTÊNCIA DE ESTADO ---

function saveState() {
    try {
        localStorage.setItem('habits', JSON.stringify(habits));
        localStorage.setItem('records', JSON.stringify(records));
    } catch (e) {
        console.warn("saveState: não foi possível salvar no localStorage", e);
    }
}

function loadState() {
    const habitsJson = localStorage.getItem('habits');
    const recordsJson = localStorage.getItem('records');
    
    if (habitsJson) {
        try { habits = JSON.parse(habitsJson); } catch (e) { console.warn("habits parse falhou", e); }
    }
    if (recordsJson) {
        try { records = JSON.parse(recordsJson); } catch (e) { console.warn("records parse falhou", e); }
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
    // Retorna algo legível para UI: "seg., 24 de nov."
    return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function formatWeekRange(startDate) {
    // Retorna string amigável para faixa da semana, ex: "24 nov - 30 nov"
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit' });
    const monthFmt = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

    const sDay = dayFmt.format(start);
    const sMonth = monthFmt.format(start).replace('.', '');
    const eDay = dayFmt.format(end);
    const eMonth = monthFmt.format(end).replace('.', '');

    if (sMonth.toLowerCase() === eMonth.toLowerCase()) {
        return `${sDay} - ${eDay} ${capitalizeFirst(sMonth)}`;
    } else {
        return `${sDay} ${capitalizeFirst(sMonth)} - ${eDay} ${capitalizeFirst(eMonth)}`;
    }
}

function capitalizeFirst(s) {
    if (!s || typeof s !== 'string') return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// --- FUNÇÕES DE CRUD DO HÁBITO (Alterar e Excluir) ---

function addHabit(name, color) {
    const newHabit = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `id_${Date.now()}`,
        name: name,
        color: color
    };
    habits.push(newHabit);
    records[newHabit.id] = {};
    saveState();
}

function deleteHabit(habitId) {
    if (confirm("Tem certeza que deseja excluir este hábito permanentemente?")) {
        habits = habits.filter(h => h.id !== habitId);
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

    const newName = prompt(`Digite o novo nome para "${habitToEdit.name}":`, habitToEdit.name);
    
    if (newName && newName.trim() !== habitToEdit.name) {
        habitToEdit.name = newName.trim();
        renderApp();
        alert(`Hábito "${newName}" atualizado com sucesso!`);
    } else if (newName === null) {
        return;
    }
}

function setCompletion(habitId, dateKey, isCompleted) {
    if (!records[habitId]) {
        records[habitId] = {};
    }
    records[habitId][dateKey] = !!isCompleted;
    saveState();
    renderApp();
}

function toggleCompletion(habitId, dateKey) {
    if (!records[habitId]) {
        records[habitId] = {};
    }
    records[habitId][dateKey] = !records[habitId][dateKey];
    saveState();
    renderApp();
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---

function renderHabitGrid() {
    const container = document.getElementById('habit-rows');
    if (!container) return;

    const tempContainer = document.createElement('div');

    if (habits.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / span 9; text-align: center; margin-top: 20px; color: var(--color-text-secondary);">Adicione seu primeiro hábito para começar a rastrear!</div>';
        // também atualiza a faixa da semana mesmo sem hábitos
        const rangeEl = document.getElementById('current-week-range');
        if (rangeEl) rangeEl.textContent = formatWeekRange(currentWeekStart);
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
            
            const isChecked = !!(records[habit.id] && records[habit.id][dateKey]);
            
            if (isChecked) {
                completedCount++;
            }
            
            const cell = document.createElement('div');
            cell.className = `grid-cell ${isChecked ? 'checked' : ''}`;
            if (isChecked) {
                cell.style.setProperty('--habit-color', habit.color);
            }
            
            // atenção: onclick usa toggleCompletion definida globalmente
            cell.onclick = () => toggleCompletion(habit.id, dateKey);
            
            tempContainer.appendChild(cell);
        }
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-column';
        statsDiv.textContent = `${completedCount}/7`;
        tempContainer.appendChild(statsDiv);
    });
    
    container.innerHTML = tempContainer.innerHTML;

    const rangeEl = document.getElementById('current-week-range');
    if (rangeEl) {
        rangeEl.textContent = formatWeekRange(currentWeekStart);
    }
}

function renderDailyGoals() {
    const container = document.getElementById('daily-goals-list');
    if (!container) return;
    container.innerHTML = '';
    
    const todayKey = formatDateKey(today);
    let completedGoals = 0;
    
    if (habits.length === 0) {
        container.innerHTML = '<p class="placeholder">Nenhum hábito para hoje. Adicione um!</p>';
        updateDailyProgress(0);
        return;
    }

    habits.forEach(habit => {
        const isCompleted = !!(records[habit.id] && records[habit.id][todayKey]);
        if (isCompleted) {
            completedGoals++;
        }
        
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${isCompleted ? 'completed' : 'pending'}`;
        goalItem.style.setProperty('--habit-color', habit.color);
        
        goalItem.innerHTML = `
            <h3>${escapeHtml(habit.name)}</h3>
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
    
    const fillEl = document.getElementById('daily-progress-fill');
    const textEl = document.getElementById('daily-progress-text');
    const todayDateEl = document.getElementById('today-date');

    if (fillEl) fillEl.style.width = `${percent}%`;
    if (textEl) textEl.textContent = `${percent}% do objetivo diário alcançado`;
    if (todayDateEl) {
        // Ex.: "sex., 28/11" — mantive formato curto para caber no layout
        todayDateEl.textContent = today.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'numeric' });
    }
}

// --- RECEPTOR DE NOVOS HÁBITOS ---

function checkAndAddNewHabits() {
    const pendingHabitsJson = localStorage.getItem('pendingHabits');
    
    if (pendingHabitsJson) {
        try {
            const pendingHabits = JSON.parse(pendingHabitsJson);
            
            pendingHabits.forEach(data => {
                if (data && data.name) addHabit(data.name, data.color || '#FFB347');
            });
            
            localStorage.removeItem('pendingHabits');
            
        } catch (e) {
            console.error("Erro ao carregar hábitos pendentes:", e);
        }
    }
}

// --- UTIL ---
// Pequena função para evitar injeção ao inserir nomes em innerHTML
function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

// --- INICIALIZAÇÃO E RENDERIZAÇÃO PRINCIPAL ---

function renderApp() {
    renderHabitGrid();
    renderDailyGoals();
    saveState();
}

document.addEventListener('DOMContentLoaded', () => {
    // Carrega estado salvo
    loadState();
    // Checa hábitos que podem ter sido adicionados por outra tela
    checkAndAddNewHabits();
    // Preenche nome do usuário no header (se existir)
    populateUserName();
    // Render principal
    renderApp();
    // Conecta botões de navegação semanal de forma segura
    safeAttachWeekNavHandlers();
});

// --- CONTROLE DE EVENTOS (NAVEGAÇÃO SEMANAL) ---
function safeAttachWeekNavHandlers() {
    const prevBtn = document.getElementById('prev-week');
    const nextBtn = document.getElementById('next-week');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() - 7);
            renderApp();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentWeekStart.setDate(currentWeekStart.getDate() + 7);
            renderApp();
        });
    }
}

// --- PRENCHIMENTO DO NOME DO USUÁRIO NO HEADER ---
function readStoredUser() {
    const raw = localStorage.getItem("currentUser") ?? sessionStorage.getItem("currentUser");
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            if (parsed.user && typeof parsed.user === "object") return parsed.user;
            return parsed;
        }
    } catch (e) {
        // não era JSON - pode ser só o nome em texto
        return { name: raw };
    }
    return null;
}

function populateUserName() {
    const span = document.getElementById('userName');
    if (!span) return;

    const stored = readStoredUser();
    if (!stored) return;

    const name = stored.name ?? stored.fullName ?? stored.username ?? stored.nome ?? null;
    if (!name) return;

    span.textContent = name;
}

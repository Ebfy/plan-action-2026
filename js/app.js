/**
 * Plan d'Action 2026 - Application JavaScript
 * Version 1.0 - GitHub Ready
 */

class PlanAction2026 {
    constructor() {
        this.currentUser = null;
        this.data = this.loadData();
        this.charts = {};
        this.currentPage = 'dashboard';
        this.currentMonth = new Date();
        this.evaluationsManager = null; // Initialisé après chargement
        
        this.init();
    }

    // Initialisation
    init() {
        this.initTheme();
        this.bindEvents();
        this.checkAuth();
        
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 1500);
    }

    // Gestion des données (LocalStorage)
    loadData() {
        const saved = localStorage.getItem('planAction2026');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialiser avec données par défaut
        localStorage.setItem('planAction2026', JSON.stringify(APP_DATA));
        return APP_DATA;
    }

    saveData() {
        localStorage.setItem('planAction2026', JSON.stringify(this.data));
    }

    // Thème
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Authentification
    checkAuth() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showApp();
        } else {
            this.showLogin();
        }
    }

    login(username, password) {
        const user = Object.values(this.data.users).find(
            u => u.username === username && u.password === password
        );
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showApp();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
    }

    showApp() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'grid';
        
        // Initialiser le gestionnaire d'évaluations
        this.evaluationsManager = new EvaluationsManager(this);
        
        this.updateUserInfo();
        this.loadDashboard();
        this.setupCharts();
        
        // Afficher menu admin si admin
        if (this.currentUser.role === 'admin') {
            document.getElementById('nav-admin').style.display = 'flex';
        }
        
        // Vérifier les évaluations en attente
        this.checkPendingEvaluations();
    }

    updateUserInfo() {
        document.getElementById('user-name-display').textContent = this.currentUser.nom;
        document.getElementById('user-role-display').textContent = 
            this.currentUser.role === 'admin' ? 'Admin' : 'Standard';
        document.getElementById('user-vision').textContent = `« ${this.currentUser.vision} »`;
        document.getElementById('user-theme').textContent = this.currentUser.theme;
    }

    // Navigation
    navigateTo(page) {
        this.currentPage = page;
        
        // Mettre à jour nav active
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        
        // Afficher la page
        document.querySelectorAll('.page-content').forEach(p => {
            p.classList.toggle('active', p.id === `page-${page}`);
        });
        
        // Charger le contenu
        switch(page) {
            case 'dashboard': this.loadDashboard(); break;
            case 'objectifs': this.loadObjectifs(); break;
            case 'saisie': this.loadSaisie(); break;
            case 'calendrier': this.loadCalendrier(); break;
            case 'alarmes': this.loadAlarmes(); break;
            case 'statistiques': this.loadStatistiques(); break;
            case 'evaluations': this.loadEvaluations(); break;
            case 'equipe': this.loadEquipe(); break;
            case 'admin': this.loadAdmin(); break;
        }
        
        // Fermer sidebar sur mobile
        document.getElementById('sidebar').classList.remove('open');
    }

    // Dashboard
    loadDashboard() {
        this.updateScores();
        this.updateDomainCards();
        this.updateTodayActions();
        this.updateCharts();
    }

    updateScores() {
        const userObjectifs = this.getUserObjectifs();
        const scores = this.calculateScores(userObjectifs);
        
        // Score global
        document.getElementById('score-global-value').textContent = scores.global;
        document.getElementById('score-status').textContent = this.getScoreMessage(scores.global);
        
        // Scores par domaine
        Object.keys(this.data.domaines).forEach(domaine => {
            const score = scores.domaines[domaine] || 0;
            document.getElementById(`score-${domaine}`).textContent = score;
            document.getElementById(`progress-${domaine}`).style.width = `${score}%`;
            
            const count = userObjectifs.filter(o => o.domaine === domaine).length;
            document.getElementById(`count-${domaine}`).textContent = count;
        });
    }

    getUserObjectifs() {
        return Object.values(this.data.objectifs).filter(
            o => o.userId === this.currentUser.id
        );
    }

    calculateScores(objectifs) {
        const scores = { global: 0, domaines: {} };
        
        if (objectifs.length === 0) return scores;
        
        let totalScore = 0;
        const domaineScores = {};
        const domaineCounts = {};
        
        objectifs.forEach(obj => {
            const score = obj.progression?.pourcentage || 0;
            totalScore += score;
            
            if (!domaineScores[obj.domaine]) {
                domaineScores[obj.domaine] = 0;
                domaineCounts[obj.domaine] = 0;
            }
            domaineScores[obj.domaine] += score;
            domaineCounts[obj.domaine]++;
        });
        
        scores.global = Math.round(totalScore / objectifs.length);
        
        Object.keys(domaineScores).forEach(d => {
            scores.domaines[d] = Math.round(domaineScores[d] / domaineCounts[d]);
        });
        
        return scores;
    }

    getScoreMessage(score) {
        if (score >= 80) return '🟢 Excellent ! Continue ainsi !';
        if (score >= 50) return '🟡 Tu peux faire mieux !';
        if (score > 0) return '🔴 Attention, objectifs en danger !';
        return 'Commencez à saisir vos objectifs !';
    }

    getScoreColor(score) {
        if (score >= 80) return 'green';
        if (score >= 50) return 'orange';
        return 'red';
    }

    updateDomainCards() {
        document.querySelectorAll('.domain-card').forEach(card => {
            const domaine = card.dataset.domain;
            const score = parseInt(document.getElementById(`score-${domaine}`).textContent);
            
            // Mettre à jour la couleur de progression
            const progress = card.querySelector('.progress');
            progress.style.backgroundColor = this.data.domaines[domaine]?.color || '#1a5276';
        });
    }

    updateTodayActions() {
        const container = document.getElementById('today-actions');
        const today = new Date();
        const jourSemaine = this.data.jours[today.getDay()];
        
        const objectifs = this.getUserObjectifs().filter(obj => {
            return obj.joursActifs.includes(jourSemaine) || obj.joursActifs.length === 0;
        });
        
        if (objectifs.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucune action prévue aujourd\'hui</p>';
            return;
        }
        
        container.innerHTML = objectifs.map(obj => `
            <div class="action-item" data-id="${obj.id}">
                <span class="action-icon">${obj.icon}</span>
                <div class="action-info">
                    <div class="action-title">${obj.titre}</div>
                    <div class="action-time">${obj.frequence}</div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="app.markDone('${obj.id}')">✓</button>
            </div>
        `).join('');
    }

    // Charts
    setupCharts() {
        this.setupGaugeChart();
        this.setupRadarChart();
        this.setupEvolutionChart();
    }

    setupGaugeChart() {
        const ctx = document.getElementById('gauge-global');
        if (!ctx) return;
        
        const score = parseInt(document.getElementById('score-global-value').textContent) || 0;
        
        if (this.charts.gauge) this.charts.gauge.destroy();
        
        this.charts.gauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [score, 100 - score],
                    backgroundColor: [this.getScoreColorHex(score), '#e0e0e0'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '75%',
                rotation: -90,
                circumference: 180,
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    }

    setupRadarChart() {
        const ctx = document.getElementById('radar-chart');
        if (!ctx) return;
        
        const userObjectifs = this.getUserObjectifs();
        const scores = this.calculateScores(userObjectifs);
        
        const labels = Object.values(this.data.domaines).map(d => d.nom);
        const data = Object.keys(this.data.domaines).map(d => scores.domaines[d] || 0);
        
        if (this.charts.radar) this.charts.radar.destroy();
        
        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels,
                datasets: [{
                    label: 'Score',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(26, 82, 118, 0.2)',
                    borderColor: '#1a5276',
                    pointBackgroundColor: '#1a5276'
                }]
            },
            options: {
                scales: {
                    r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    setupEvolutionChart() {
        const ctx = document.getElementById('evolution-chart');
        if (!ctx) return;
        
        // Générer données des 7 derniers jours
        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('fr-FR', { weekday: 'short' }));
            data.push(this.getScoreForDate(date));
        }
        
        if (this.charts.evolution) this.charts.evolution.destroy();
        
        this.charts.evolution = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Score',
                    data,
                    fill: true,
                    backgroundColor: 'rgba(26, 82, 118, 0.1)',
                    borderColor: '#1a5276',
                    tension: 0.4
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, max: 100 } },
                plugins: { legend: { display: false } }
            }
        });
    }

    getScoreForDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        const entries = Object.values(this.data.entries).filter(
            e => e.userId === this.currentUser.id && e.date === dateStr
        );
        
        if (entries.length === 0) return 0;
        
        const completed = entries.filter(e => e.completed).length;
        return Math.round((completed / entries.length) * 100);
    }

    getScoreColorHex(score) {
        if (score >= 80) return '#27ae60';
        if (score >= 50) return '#f39c12';
        return '#e74c3c';
    }

    updateCharts() {
        this.setupGaugeChart();
        this.setupRadarChart();
        this.setupEvolutionChart();
    }

    // Objectifs
    loadObjectifs() {
        const container = document.getElementById('objectifs-list');
        const objectifs = this.getUserObjectifs();
        const filterDomain = document.getElementById('filter-domain').value;
        
        let filtered = objectifs;
        if (filterDomain) {
            filtered = objectifs.filter(o => o.domaine === filterDomain);
        }
        
        if (filtered.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun objectif trouvé</p>';
            return;
        }
        
        container.innerHTML = filtered.map(obj => {
            const score = obj.progression?.pourcentage || 0;
            const colorClass = this.getScoreColor(score);
            
            return `
                <div class="objectif-card ${obj.domaine}" data-id="${obj.id}">
                    <div class="objectif-header">
                        <div class="objectif-title">
                            <span class="icon">${obj.icon}</span>
                            ${obj.titre}
                        </div>
                        <span class="objectif-score ${colorClass}">${score}%</span>
                    </div>
                    <p class="objectif-description">${obj.description}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${score}%; background-color: ${this.data.domaines[obj.domaine]?.color}"></div>
                    </div>
                    <div class="objectif-meta">
                        <span>${obj.frequence}</span>
                        <span>🔥 ${obj.serie} jours</span>
                    </div>
                    <div class="objectif-actions">
                        <button class="btn btn-secondary" onclick="app.editObjectif('${obj.id}')">✏️ Modifier</button>
                        <button class="btn btn-primary" onclick="app.quickEntry('${obj.id}')">📝 Saisir</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Saisie quotidienne
    loadSaisie() {
        const dateInput = document.getElementById('saisie-date');
        dateInput.value = new Date().toISOString().split('T')[0];
        this.renderSaisieForm(dateInput.value);
    }

    renderSaisieForm(date) {
        const container = document.getElementById('saisie-form-container');
        const objectifs = this.getUserObjectifs();
        
        container.innerHTML = objectifs.map(obj => {
            const entry = this.getEntry(obj.id, date);
            const completed = entry?.completed || false;
            
            return `
                <div class="saisie-card" data-objectif="${obj.id}">
                    <div class="saisie-card-header">
                        <span class="icon">${obj.icon}</span>
                        <h4>${obj.titre}</h4>
                        <span class="status">${completed ? '✅' : '⬜'}</span>
                    </div>
                    <div class="saisie-fields">
                        <div class="saisie-field">
                            <label>
                                <input type="checkbox" class="saisie-completed" ${completed ? 'checked' : ''}>
                                Objectif réalisé aujourd'hui
                            </label>
                        </div>
                        ${this.renderSaisieFields(obj, entry)}
                        <div class="saisie-field">
                            <label>Notes (optionnel)</label>
                            <textarea class="form-control saisie-notes" rows="2" placeholder="Commentaires...">${entry?.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSaisieFields(obj, entry) {
        let fields = '';
        
        switch(obj.cible?.type) {
            case 'chapitres':
                fields = `
                    <div class="saisie-field">
                        <label>Nombre de chapitres lus</label>
                        <input type="number" class="form-control saisie-value" min="0" value="${entry?.value || 0}">
                    </div>
                `;
                break;
            case 'duree':
                fields = `
                    <div class="saisie-field">
                        <label>Durée (minutes)</label>
                        <input type="number" class="form-control saisie-value" min="0" value="${entry?.duration || 0}">
                    </div>
                `;
                break;
            case 'montant':
                fields = `
                    <div class="saisie-field">
                        <label>Montant (XAF)</label>
                        <input type="number" class="form-control saisie-value" min="0" step="1000" value="${entry?.value || 0}">
                    </div>
                `;
                break;
            case 'sessions':
                fields = `
                    <div class="saisie-field">
                        <label>Session effectuée</label>
                        <select class="form-control saisie-value">
                            <option value="1" ${entry?.value === 1 ? 'selected' : ''}>Oui</option>
                            <option value="0" ${!entry?.value ? 'selected' : ''}>Non</option>
                        </select>
                    </div>
                `;
                break;
            case 'heure':
                fields = `
                    <div class="saisie-field">
                        <label>Heure de départ</label>
                        <input type="time" class="form-control saisie-depart" value="${entry?.metadata?.heureDepart || ''}">
                    </div>
                    <div class="saisie-field">
                        <label>Heure d'arrivée</label>
                        <input type="time" class="form-control saisie-arrivee" value="${entry?.metadata?.heureArrivee || ''}">
                    </div>
                `;
                break;
            default:
                fields = `
                    <div class="saisie-field">
                        <label>Valeur</label>
                        <input type="number" class="form-control saisie-value" min="0" value="${entry?.value || 0}">
                    </div>
                `;
        }
        
        return fields;
    }

    getEntry(objectifId, date) {
        const key = `${this.currentUser.id}_${objectifId}_${date}`;
        return this.data.entries[key];
    }

    saveSaisie() {
        const date = document.getElementById('saisie-date').value;
        const cards = document.querySelectorAll('.saisie-card');
        
        cards.forEach(card => {
            const objectifId = card.dataset.objectif;
            const completed = card.querySelector('.saisie-completed')?.checked || false;
            const value = parseFloat(card.querySelector('.saisie-value')?.value) || 0;
            const notes = card.querySelector('.saisie-notes')?.value || '';
            const duration = parseFloat(card.querySelector('.saisie-duration')?.value) || value;
            
            const key = `${this.currentUser.id}_${objectifId}_${date}`;
            
            this.data.entries[key] = {
                id: key,
                userId: this.currentUser.id,
                objectifId,
                date,
                completed,
                value,
                duration,
                notes,
                createdAt: new Date().toISOString(),
                metadata: {}
            };
            
            // Mettre à jour la progression de l'objectif
            this.updateObjectifProgression(objectifId);
        });
        
        this.saveData();
        this.showToast('Saisie enregistrée avec succès !', 'success');
        this.loadDashboard();
    }

    updateObjectifProgression(objectifId) {
        const objectif = this.data.objectifs[objectifId];
        if (!objectif) return;
        
        const entries = Object.values(this.data.entries).filter(
            e => e.objectifId === objectifId && e.userId === this.currentUser.id
        );
        
        const completedCount = entries.filter(e => e.completed).length;
        const totalValue = entries.reduce((sum, e) => sum + (e.value || 0), 0);
        
        // Calculer progression selon le type d'objectif
        let pourcentage = 0;
        if (objectif.cible?.type === 'chapitres') {
            pourcentage = Math.min(100, Math.round((totalValue / objectif.cible.valeur) * 100));
            objectif.progression.valeur = totalValue;
        } else if (objectif.cible?.type === 'montant') {
            pourcentage = Math.min(100, Math.round((totalValue / objectif.cible.valeur) * 100));
            objectif.progression.valeur = totalValue;
        } else {
            // Pour les objectifs basés sur la fréquence
            const targetDays = this.getDaysInYear(objectif);
            pourcentage = Math.min(100, Math.round((completedCount / targetDays) * 100));
        }
        
        objectif.progression.pourcentage = pourcentage;
        
        // Calculer série
        objectif.serie = this.calculateStreak(objectifId);
    }

    getDaysInYear(objectif) {
        if (objectif.frequence.includes('Quotidien')) return 365;
        if (objectif.frequence.includes('semaine')) {
            const times = parseInt(objectif.frequence) || objectif.joursActifs.length || 2;
            return times * 52;
        }
        if (objectif.frequence.includes('Mensuel')) return 12;
        return 100;
    }

    calculateStreak(objectifId) {
        const entries = Object.values(this.data.entries)
            .filter(e => e.objectifId === objectifId && e.userId === this.currentUser.id && e.completed)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (entries.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        
        for (const entry of entries) {
            const entryDate = new Date(entry.date);
            const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 1) {
                streak++;
                currentDate = entryDate;
            } else {
                break;
            }
        }
        
        return streak;
    }

    markDone(objectifId) {
        const today = new Date().toISOString().split('T')[0];
        const key = `${this.currentUser.id}_${objectifId}_${today}`;
        
        this.data.entries[key] = {
            id: key,
            userId: this.currentUser.id,
            objectifId,
            date: today,
            completed: true,
            value: 1,
            createdAt: new Date().toISOString()
        };
        
        this.updateObjectifProgression(objectifId);
        this.saveData();
        this.showToast('Objectif marqué comme fait !', 'success');
        this.loadDashboard();
    }

    quickEntry(objectifId) {
        document.getElementById('saisie-date').value = new Date().toISOString().split('T')[0];
        this.navigateTo('saisie');
        
        setTimeout(() => {
            const card = document.querySelector(`.saisie-card[data-objectif="${objectifId}"]`);
            if (card) card.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    // Calendrier
    loadCalendrier() {
        this.renderCalendar();
    }

    renderCalendar() {
        const container = document.getElementById('calendar-grid');
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        // Mettre à jour le titre
        document.getElementById('current-month').textContent = 
            `${this.data.mois[month]} ${year}`;
        
        // Headers
        let html = this.data.joursAbrev.map(j => 
            `<div class="calendar-day header">${j}</div>`
        ).join('');
        
        // Premier jour du mois
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Jours du mois précédent
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day other-month">${prevMonthDays - i}</div>`;
        }
        
        // Jours du mois actuel
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const score = this.getScoreForDate(date);
            const colorClass = score > 0 ? this.getScoreColor(score) : 'gray';
            const isToday = date.toDateString() === today.toDateString();
            
            html += `
                <div class="calendar-day ${colorClass} ${isToday ? 'today' : ''}" 
                     data-date="${dateStr}"
                     onclick="app.openDayDetail('${dateStr}')">
                    ${day}
                </div>
            `;
        }
        
        // Jours du mois suivant
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
        const remaining = totalCells - firstDay - daysInMonth;
        for (let i = 1; i <= remaining; i++) {
            html += `<div class="calendar-day other-month">${i}</div>`;
        }
        
        container.innerHTML = html;
    }

    prevMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.renderCalendar();
    }

    openDayDetail(dateStr) {
        document.getElementById('saisie-date').value = dateStr;
        this.navigateTo('saisie');
        this.renderSaisieForm(dateStr);
    }

    // Alarmes
    loadAlarmes() {
        const container = document.getElementById('alarmes-list');
        const alarmes = Object.values(this.data.alarmes).filter(
            a => a.userId === this.currentUser.id
        );
        
        if (alarmes.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucune alarme configurée</p>';
            return;
        }
        
        container.innerHTML = alarmes.map(alarme => `
            <div class="alarme-card" data-id="${alarme.id}">
                <div class="alarme-time">${alarme.heure}</div>
                <div class="alarme-info">
                    <div class="alarme-title">${alarme.titre}</div>
                    <div class="alarme-days">${this.formatAlarmeDays(alarme)}</div>
                </div>
                <label class="alarme-toggle">
                    <input type="checkbox" ${alarme.actif ? 'checked' : ''} 
                           onchange="app.toggleAlarme('${alarme.id}')">
                    <span class="slider"></span>
                </label>
            </div>
        `).join('');
    }

    formatAlarmeDays(alarme) {
        if (alarme.recurrence === 'quotidien') return 'Tous les jours';
        if (alarme.recurrence === 'mensuel') return `Le ${alarme.jours[0]} du mois`;
        if (alarme.jours.length === 7) return 'Tous les jours';
        if (alarme.jours.length === 5 && !alarme.jours.includes('samedi')) return 'Lun-Ven';
        return alarme.jours.map(j => j.substring(0, 3)).join(', ');
    }

    toggleAlarme(alarmeId) {
        if (this.data.alarmes[alarmeId]) {
            this.data.alarmes[alarmeId].actif = !this.data.alarmes[alarmeId].actif;
            this.saveData();
        }
    }

    // Statistiques
    loadStatistiques() {
        const objectifs = this.getUserObjectifs();
        const entries = Object.values(this.data.entries).filter(
            e => e.userId === this.currentUser.id
        );
        
        // Série actuelle
        const maxStreak = Math.max(...objectifs.map(o => o.serie), 0);
        document.getElementById('stat-serie').textContent = maxStreak;
        
        // Objectifs atteints (>= 80%)
        const completed = objectifs.filter(o => o.progression?.pourcentage >= 80).length;
        document.getElementById('stat-completed').textContent = completed;
        
        // Score moyen
        const scores = this.calculateScores(objectifs);
        document.getElementById('stat-avg').textContent = `${scores.global}%`;
        
        // Meilleur domaine
        let bestDomain = '-';
        let bestScore = 0;
        Object.entries(scores.domaines).forEach(([domain, score]) => {
            if (score > bestScore) {
                bestScore = score;
                bestDomain = this.data.domaines[domain]?.nom || domain;
            }
        });
        document.getElementById('stat-best').textContent = bestDomain;
    }

    // Équipe
    loadEquipe() {
        const container = document.getElementById('team-grid');
        const users = Object.values(this.data.users);
        
        container.innerHTML = users.map(user => {
            const userObjectifs = Object.values(this.data.objectifs).filter(o => o.userId === user.id);
            const scores = this.calculateScores(userObjectifs);
            
            return `
                <div class="team-card">
                    <div class="team-avatar">${user.avatar}</div>
                    <div class="team-name">${user.nom}</div>
                    <div class="team-score">${scores.global}%</div>
                    <div class="team-streak">🔥 ${user.serieActuelle || 0} jours</div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${scores.global}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Administration
    loadAdmin() {
        if (this.currentUser.role !== 'admin') {
            this.navigateTo('dashboard');
            return;
        }
        
        const container = document.getElementById('admin-users-list');
        const users = Object.values(this.data.users);
        
        container.innerHTML = users.map(user => `
            <div class="admin-user-item">
                <div>
                    <span>${user.avatar}</span>
                    <strong>${user.nom}</strong>
                    <span class="role-badge">${user.role}</span>
                </div>
                <div>
                    <button class="btn btn-sm btn-secondary" onclick="app.editUser('${user.id}')">✏️</button>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // ÉVALUATIONS
    // ============================================
    
    checkPendingEvaluations() {
        const objectifs = this.getUserObjectifs();
        let pendingCount = 0;
        
        // Utiliser le nouveau système avec getPendingEvaluations
        const pending = this.evaluationsManager.getPendingEvaluations();
        pendingCount = pending.length;
        
        // Afficher une notification si des évaluations sont en attente
        if (pendingCount > 0) {
            const hasVictoires = pending.some(p => p.periode === 'trimestrielle');
            setTimeout(() => {
                if (hasVictoires) {
                    this.showToast(`🏆 Bilan trimestriel en attente ! Célébrez vos victoires`, 'warning');
                } else {
                    this.showToast(`📋 ${pendingCount} évaluation(s) en attente`, 'warning');
                }
            }, 2000);
        }
    }
    
    loadEvaluations(tab = 'pending') {
        const container = document.getElementById('evaluations-content');
        
        // Gérer les onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        switch(tab) {
            case 'pending':
                this.renderPendingEvaluations(container);
                break;
            case 'history':
                this.renderEvaluationsHistory(container);
                break;
            case 'compare':
                this.renderEvaluationsComparison(container);
                break;
            case 'victoires':
                this.renderVictoiresWall(container);
                break;
        }
    }
    
    renderPendingEvaluations(container) {
        const pending = this.evaluationsManager.getPendingEvaluations();
        
        if (pending.length === 0) {
            container.innerHTML = '<div class="empty-state">✅ Toutes les évaluations sont à jour !</div>';
            return;
        }
        
        // Grouper par urgence
        const haute = pending.filter(p => p.urgence === 'haute');
        const moyenne = pending.filter(p => p.urgence === 'moyenne');
        
        let html = '';
        
        // Alerte pour les évaluations trimestrielles (victoires)
        const trimestrielles = pending.filter(p => p.periode === 'trimestrielle');
        if (trimestrielles.length > 0) {
            html += `
                <div class="victoires-section" style="margin-bottom: 25px;">
                    <h4>🏆 Bilan Trimestriel - Célébrez vos Victoires !</h4>
                    <p class="victoires-intro">C'est le moment de faire le point sur le trimestre écoulé et d'identifier vos 3 moments de victoire.</p>
                </div>
            `;
        }
        
        // Évaluations urgentes
        if (haute.length > 0) {
            html += `
                <div class="evaluations-alert">
                    <h4>⚠️ Évaluations urgentes (${haute.length})</h4>
                    ${haute.map(ev => this.renderPendingEvalItem(ev)).join('')}
                </div>
            `;
        }
        
        // Autres évaluations
        if (moyenne.length > 0) {
            html += `
                <div class="evaluations-list">
                    <h4 style="margin-bottom: 15px;">📋 Évaluations à compléter</h4>
                    ${moyenne.map(ev => this.renderPendingEvalItem(ev)).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    renderPendingEvalItem(evalInfo) {
        const { objectif, type, periode, label } = evalInfo;
        const periodeLabel = PERIODES_EVALUATION[periode]?.nom || 'Mensuelle';
        const periodeIcon = PERIODES_EVALUATION[periode]?.icon || '📅';
        
        return `
            <div class="pending-evaluation-item ${periode === 'trimestrielle' ? 'victoire-item' : ''}">
                <div class="pending-evaluation-info">
                    <span class="title">${objectif.icon || '🎯'} ${objectif.titre}</span>
                    <span class="label">${periodeIcon} ${label}</span>
                </div>
                <button class="btn-eval ${type}" onclick="app.openEvaluation('${objectif.id}', '${type}', '${periode}')">
                    ${type === 'avant' ? '📋 AVANT' : '📊 APRÈS'}
                </button>
            </div>
        `;
    }
    
    renderVictoiresWall(container) {
        const victoires = this.evaluationsManager.getVictoiresReport();
        
        if (victoires.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span style="font-size: 3rem;">🏆</span>
                    <h3>Vos Moments de Victoire</h3>
                    <p>Aucune victoire enregistrée pour l'instant.</p>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Les victoires sont collectées lors des bilans trimestriels.
                    </p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="victoires-dashboard">';
        html += '<h3>🏆 Mur des Victoires</h3>';
        
        // Grouper par trimestre
        const parTrimestre = {};
        victoires.forEach(v => {
            const key = `T${v.trimestre} ${new Date(v.date).getFullYear()}`;
            if (!parTrimestre[key]) parTrimestre[key] = [];
            parTrimestre[key].push(v);
        });
        
        Object.entries(parTrimestre).forEach(([trimestre, items]) => {
            html += `<h4 style="margin: 20px 0 15px; color: var(--text-secondary);">📅 ${trimestre}</h4>`;
            items.forEach(v => {
                html += `
                    <div class="victoire-card">
                        <span class="victoire-rank">${v.rang}</span>
                        <div class="victoire-text">${this.escapeHtml(v.texte)}</div>
                        <div class="victoire-meta">
                            <span class="objectif-badge">${v.objectifIcon} ${v.objectifTitre}</span>
                            <span class="periode-badge">${v.periode}</span>
                        </div>
                    </div>
                `;
            });
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    renderEvaluationsHistory(container) {
        const evaluations = Object.values(this.data.evaluations || {})
            .filter(e => e.userId === this.currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (evaluations.length === 0) {
            container.innerHTML = '<div class="empty-state">Aucune évaluation enregistrée</div>';
            return;
        }
        
        let html = '<div class="evaluations-history">';
        
        evaluations.forEach(ev => {
            const objectif = this.data.objectifs[ev.objectifId];
            if (!objectif) return;
            
            const date = new Date(ev.date).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            
            const periodeInfo = PERIODES_EVALUATION[ev.periode] || PERIODES_EVALUATION.mensuelle;
            const hasVictoires = ev.responses?.victoire_1 || ev.responses?.victoire_semestrielle_1;
            
            html += `
                <div class="evaluation-card ${hasVictoires ? 'has-victoires' : ''}">
                    <div class="evaluation-card-header">
                        <h4><span>${objectif.icon}</span> ${objectif.titre}</h4>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="evaluation-badge ${ev.type}">${ev.type === 'avant' ? '📋 AVANT' : '📊 APRÈS'}</span>
                            ${hasVictoires ? '<span class="victoire-badge">🏆</span>' : ''}
                        </div>
                    </div>
                    <p><strong>Date:</strong> ${date} | <strong>Période:</strong> ${periodeInfo.icon} ${periodeInfo.nom}</p>
                    <button class="btn btn-sm btn-secondary" onclick="app.viewEvaluation('${ev.id}')">👁️ Voir détails</button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    renderEvaluationsComparison(container) {
        const objectifs = this.getUserObjectifs();
        let html = '<div class="comparison-list">';
        
        objectifs.forEach(obj => {
            const progression = this.evaluationsManager.calculateProgression(obj.id);
            const synthesis = this.evaluationsManager.generateProgressSummary(obj.id);
            
            if (progression) {
                html += `
                    <div class="evaluation-card">
                        <div class="evaluation-card-header">
                            <h4><span>${obj.icon}</span> ${obj.titre}</h4>
                            <span class="evaluation-badge ${progression.summary.overallTrend}">
                                ${progression.summary.overallTrend === 'positive' ? '📈 Progression' : 
                                  progression.summary.overallTrend === 'negative' ? '📉 Régression' : '➡️ Stable'}
                            </span>
                        </div>
                        
                        <div class="progression-grid">
                            ${Object.entries(progression.comparison).slice(0, 6).map(([key, data]) => `
                                <div class="progression-item">
                                    <span class="field-name">${key.replace(/_/g, ' ')}</span>
                                    <div class="values">
                                        <span class="value avant">${data.avant}</span>
                                        <span class="arrow">→</span>
                                        <span class="value apres">${data.apres}</span>
                                    </div>
                                    <div class="diff ${data.difference > 0 ? 'positive' : data.difference < 0 ? 'negative' : ''}">
                                        ${data.difference > 0 ? '+' : ''}${data.difference}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="comparison-summary">
                            <div class="summary-item positive">
                                <div class="value">${progression.summary.improvements}</div>
                                <div class="label">Améliorations</div>
                            </div>
                            <div class="summary-item negative">
                                <div class="value">${progression.summary.declines}</div>
                                <div class="label">Régressions</div>
                            </div>
                            <div class="summary-item neutral">
                                <div class="value">${progression.summary.stable}</div>
                                <div class="label">Stables</div>
                            </div>
                        </div>
                        
                        ${synthesis ? `
                            <div class="ai-synthesis">
                                <h4>🤖 Synthèse IA</h4>
                                <div class="synthesis-content">
                                    <span>${synthesis.icon}</span> ${synthesis.message}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        });
        
        if (html === '<div class="comparison-list">') {
            html += '<div class="empty-state">Pas assez de données pour comparer. Remplissez d\'abord des évaluations AVANT et APRÈS.</div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    openEvaluation(objectifId, type, periode = 'mensuelle') {
        const objectif = this.data.objectifs[objectifId];
        if (!objectif) return;
        
        const formHtml = this.evaluationsManager.renderEvaluationForm(objectif, type, periode);
        const periodeInfo = PERIODES_EVALUATION[periode] || PERIODES_EVALUATION.mensuelle;
        
        const content = `
            ${formHtml}
            <div class="evaluation-form-actions" style="margin-top: 20px; text-align: right;">
                <button class="btn btn-primary" onclick="app.submitEvaluation('${objectifId}', '${type}', '${periode}')">
                    💾 Enregistrer l'évaluation
                </button>
            </div>
        `;
        
        this.showModal(`${periodeInfo.icon} ${periodeInfo.nom} - ${type === 'avant' ? 'AVANT' : 'APRÈS'}`, content, null);
        
        // Masquer les boutons par défaut du modal
        document.getElementById('modal-footer').style.display = 'none';
    }
    
    submitEvaluation(objectifId, type, periode = 'mensuelle') {
        const formContainer = document.querySelector('.evaluation-form');
        if (!formContainer) return;
        
        const responses = this.evaluationsManager.collectResponses(formContainer);
        
        // Vérifier que des réponses ont été données
        const hasResponses = Object.values(responses).some(v => v !== '' && v !== undefined);
        if (!hasResponses) {
            this.showToast('Veuillez remplir au moins quelques champs', 'error');
            return;
        }
        
        // Vérifier les victoires pour les évaluations trimestrielles
        if (periode === 'trimestrielle' && type === 'apres') {
            if (!responses.victoire_1 || !responses.victoire_2 || !responses.victoire_3) {
                this.showToast('🏆 Veuillez renseigner vos 3 moments de victoire !', 'warning');
                return;
            }
        }
        
        // Sauvegarder
        const evalId = this.evaluationsManager.saveEvaluation(objectifId, type, periode, responses);
        
        // Fermer le modal et réafficher les boutons
        document.getElementById('modal-footer').style.display = 'flex';
        this.hideModal();
        
        // Message de succès adapté
        if (periode === 'trimestrielle' && type === 'apres') {
            this.showToast(`🏆 Bilan trimestriel enregistré ! Bravo pour vos victoires !`, 'success');
        } else {
            this.showToast(`✅ Évaluation ${type.toUpperCase()} enregistrée !`, 'success');
        }
        
        // Rafraîchir la page des évaluations si on y est
        if (this.currentPage === 'evaluations') {
            this.loadEvaluations('pending');
        }
    }
    
    viewEvaluation(evalId) {
        const evaluation = this.data.evaluations[evalId];
        if (!evaluation) return;
        
        const objectif = this.data.objectifs[evaluation.objectifId];
        if (!objectif) return;
        
        const periodeInfo = PERIODES_EVALUATION[evaluation.periode] || PERIODES_EVALUATION.mensuelle;
        
        const date = new Date(evaluation.date).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        
        // Extraire les victoires si présentes
        const victoires = [];
        if (evaluation.responses.victoire_1) victoires.push(evaluation.responses.victoire_1);
        if (evaluation.responses.victoire_2) victoires.push(evaluation.responses.victoire_2);
        if (evaluation.responses.victoire_3) victoires.push(evaluation.responses.victoire_3);
        if (evaluation.responses.victoire_semestrielle_1) victoires.push(evaluation.responses.victoire_semestrielle_1);
        if (evaluation.responses.victoire_semestrielle_2) victoires.push(evaluation.responses.victoire_semestrielle_2);
        if (evaluation.responses.victoire_semestrielle_3) victoires.push(evaluation.responses.victoire_semestrielle_3);
        if (evaluation.responses.victoire_annee_1) victoires.push(evaluation.responses.victoire_annee_1);
        if (evaluation.responses.victoire_annee_2) victoires.push(evaluation.responses.victoire_annee_2);
        if (evaluation.responses.victoire_annee_3) victoires.push(evaluation.responses.victoire_annee_3);
        
        let content = `
            <div class="evaluation-view">
                <div class="evaluation-objectif-info">
                    <span class="icon">${objectif.icon || '🎯'}</span>
                    <span>${objectif.titre}</span>
                </div>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Type:</strong> ${evaluation.type === 'avant' ? '📋 AVANT' : '📊 APRÈS'}</p>
                <p><strong>Période:</strong> ${periodeInfo.icon} ${periodeInfo.nom}</p>
                <hr>
        `;
        
        // Afficher les victoires en premier si présentes
        if (victoires.length > 0) {
            content += `
                <div class="victoires-section" style="margin: 15px 0;">
                    <h4>🏆 Moments de Victoire</h4>
                    ${victoires.map((v, i) => `
                        <div class="victoire-card" style="margin-bottom: 10px;">
                            <span class="victoire-rank">${i + 1}</span>
                            <div class="victoire-text">${this.escapeHtml(v)}</div>
                        </div>
                    `).join('')}
                </div>
                <hr>
            `;
        }
        
        content += '<h4>Réponses:</h4><div class="evaluation-responses">';
        
        // Afficher toutes les réponses sauf les victoires
        const skipFields = ['victoire_1', 'victoire_2', 'victoire_3', 
                           'victoire_semestrielle_1', 'victoire_semestrielle_2', 'victoire_semestrielle_3',
                           'victoire_annee_1', 'victoire_annee_2', 'victoire_annee_3'];
        
        Object.entries(evaluation.responses).forEach(([key, value]) => {
            if (skipFields.includes(key)) return;
            if (value === undefined || value === '' || value === null) return;
            
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            let displayValue = value;
            
            if (typeof value === 'boolean') {
                displayValue = value ? 'Oui ✅' : 'Non ❌';
            } else if (typeof value === 'number') {
                displayValue = value;
            }
            
            content += `
                <div class="response-item" style="margin-bottom: 10px; padding: 10px; background: var(--bg-primary); border-radius: 8px;">
                    <strong>${label}:</strong><br>
                    <span>${displayValue}</span>
                </div>
            `;
        });
        
        content += '</div></div>';
        
        this.showModal('Détails de l\'évaluation', content, null);
        document.getElementById('modal-confirm').style.display = 'none';
    }

    // Modal
    showModal(title, content, onConfirm) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal').classList.add('show');
        
        this.modalConfirmCallback = onConfirm;
    }

    hideModal() {
        document.getElementById('modal').classList.remove('show');
        this.modalConfirmCallback = null;
    }

    confirmModal() {
        if (this.modalConfirmCallback) {
            this.modalConfirmCallback();
        }
        this.hideModal();
    }

    // Toast
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    // Vision
    editVision() {
        const content = `
            <div class="form-group">
                <label>Ma Vision 2026</label>
                <textarea id="edit-vision-input" class="form-control" rows="3" maxlength="200">${this.currentUser.vision}</textarea>
            </div>
            <div class="form-group">
                <label>Mon Thème</label>
                <input type="text" id="edit-theme-input" class="form-control" maxlength="50" value="${this.currentUser.theme}">
            </div>
        `;
        
        this.showModal('Modifier ma vision', content, () => {
            const vision = document.getElementById('edit-vision-input').value;
            const theme = document.getElementById('edit-theme-input').value;
            
            this.currentUser.vision = vision;
            this.currentUser.theme = theme;
            this.data.users[this.currentUser.username].vision = vision;
            this.data.users[this.currentUser.username].theme = theme;
            
            this.saveData();
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUserInfo();
            this.showToast('Vision mise à jour !', 'success');
        });
    }

    // Export
    exportJSON() {
        const exportData = {
            user: this.currentUser,
            objectifs: this.getUserObjectifs(),
            entries: Object.values(this.data.entries).filter(e => e.userId === this.currentUser.id),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-action-2026-${this.currentUser.username}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('Export JSON téléchargé !', 'success');
    }

    exportPDF() {
        this.showToast('Fonction PDF en développement', 'warning');
    }

    // Reset
    resetApp() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.')) {
            localStorage.removeItem('planAction2026');
            localStorage.removeItem('currentUser');
            location.reload();
        }
    }

    // Événements
    bindEvents() {
        // Login
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (this.login(username, password)) {
                document.getElementById('login-error').textContent = '';
            } else {
                document.getElementById('login-error').textContent = 'Identifiants incorrects';
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Menu toggle (mobile)
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        // User dropdown
        document.getElementById('user-menu-btn').addEventListener('click', () => {
            document.getElementById('user-dropdown').classList.toggle('show');
        });

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.getElementById('user-dropdown').classList.remove('show');
            }
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });

        // Saisie
        document.getElementById('saisie-date').addEventListener('change', (e) => {
            this.renderSaisieForm(e.target.value);
        });

        document.getElementById('btn-save-saisie').addEventListener('click', () => this.saveSaisie());
        document.getElementById('btn-saisie-rapide').addEventListener('click', () => this.navigateTo('saisie'));

        // Calendrier
        document.getElementById('prev-month').addEventListener('click', () => this.prevMonth());
        document.getElementById('next-month').addEventListener('click', () => this.nextMonth());

        // Vision
        document.getElementById('edit-vision-btn').addEventListener('click', () => this.editVision());

        // Filter objectifs
        document.getElementById('filter-domain').addEventListener('change', () => this.loadObjectifs());

        // Modal
        document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-confirm').addEventListener('click', () => this.confirmModal());
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.hideModal();
        });

        // Export
        document.getElementById('export-json').addEventListener('click', () => this.exportJSON());
        document.getElementById('export-pdf').addEventListener('click', () => this.exportPDF());

        // Admin
        document.getElementById('btn-reset-app')?.addEventListener('click', () => this.resetApp());

        // Onglets évaluations
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadEvaluations(btn.dataset.tab);
            });
        });

        // Alarmes
        document.getElementById('btn-add-alarme').addEventListener('click', () => {
            this.showToast('Création d\'alarme en développement', 'warning');
        });

        // Objectifs
        document.getElementById('btn-add-objectif').addEventListener('click', () => {
            this.showToast('Création d\'objectif en développement', 'warning');
        });
    }
}

// Initialiser l'application
const app = new PlanAction2026();

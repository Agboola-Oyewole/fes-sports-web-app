// Admin page functionality
let currentAdminTab = 'leagues';
let currentEditId = null;
let currentEditType = null;

document.addEventListener('DOMContentLoaded', function () {
    loadAdminData();
    setupModalListeners();
});

function setupModalListeners() {
    // Close modal when clicking overlay
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function switchAdminTab(tab) {
    currentAdminTab = tab;

    // Update tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Show/hide content
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tab}Content`).classList.remove('hidden');
}

function loadAdminData() {
    loadLeagues();
    loadTeamsAdmin();
    loadPlayersAdmin();
    loadMatchesAdmin();
    loadRulesAdmin();
}

function loadLeagues() {
    const leagues = storage.getLeagues();
    const tbody = document.getElementById('leaguesTableBody');

    if (leagues.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">No leagues found. Click "Add New" to create one.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = leagues.map(league => `
        <tr>
            <td class="team-name">${league.name}</td>
            <td>${league.sport}</td>
            <td>${league.season}</td>
            <td>
                <span class="status-${league.status}">${league.status.charAt(0).toUpperCase() + league.status.slice(1)}</span>
            </td>
            <td>${league.teams || 0}</td>
            <td>
                <div class="admin-actions">
                    <button class="action-btn edit" onclick="editLeague('${league.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteLeague('${league.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadTeamsAdmin() {
    const league = storage.getActiveLeague();
    const teams = storage.getTeams(league.id);
    const tbody = document.getElementById('teamsTableBody');

    if (teams.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">No teams found. Click "Add New" to create one.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = teams.map(team => `
        <tr>
            <td class="team-code">${team.code}</td>
            <td class="team-name">${team.name}</td>
            <td>${team.points}</td>
            <td>${team.played}</td>
            <td>${team.won}-${team.drawn}-${team.lost}</td>
            <td>
                <div class="admin-actions">
                    <button class="action-btn edit" onclick="editTeam('${team.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg></button>
                    <button class="action-btn delete" onclick="deleteTeam('${team.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function loadPlayersAdmin() {
    const players = storage.getPlayers();
    const tbody = document.getElementById('playersTableBody');

    if (players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table">No players found. Click "Add New" to create one.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = players.map(player => {
        const team = storage.getTeam(player.teamId);
        return `
            <tr>
                <td>#${player.number}</td>
                <td class="team-name">${player.name}</td>
                <td>${team ? team.code : 'N/A'}</td>
                <td>
                    <span class="position-badge ${player.position.toLowerCase()}">${player.position}</span>
                </td>
                <td>${player.gamesPlayed}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td>
                    <div class="admin-actions">
                        <button class="action-btn edit" onclick="editPlayer('${player.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg></button>
                        <button class="action-btn delete" onclick="deletePlayer('${player.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadMatchesAdmin() {
    const league = storage.getActiveLeague();
    const matches = storage.getMatches(league.id);
    const tbody = document.getElementById('matchesTableBody');

    if (matches.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table">No matches found. Click "Add New" to create one.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = matches.map(match => {
        const homeTeam = storage.getTeam(match.homeTeam);
        const awayTeam = storage.getTeam(match.awayTeam);

        return `
            <tr>
                <td>R${match.round}</td>
                <td>${homeTeam ? homeTeam.name : 'TBD'}</td>
                <td class="score">
                    ${match.status === 'completed'
                ? `${match.homeScore} - ${match.awayScore}`
                : '-'}
                </td>
                <td>${awayTeam ? awayTeam.name : 'TBD'}</td>
                <td>${formatDate(match.date)}</td>
                <td>
                    <span class="match-status-badge ${match.status}">${match.status.toUpperCase()}</span>
                </td>
                <td>
                    <div class="admin-actions">
                        <button class="action-btn edit" onclick="editMatch('${match.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg></button>
                        <button class="action-btn delete" onclick="deleteMatch('${match.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadRulesAdmin() {
    const league = storage.getActiveLeague();
    const rules = storage.getRules(league.id);
    const tbody = document.getElementById('rulesTableBody');

    if (rules.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">No rules found. Click "Add New" to create one.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = rules.map(rule => `
        <tr>
            <td class="team-name">${rule.title}</td>
            <td>
                <span class="rule-category ${rule.category || 'general'}">${rule.category || 'General'}</span>
            </td>
            <td>${formatDate(rule.created)}</td>
            <td>
                <div class="admin-actions">
                    <button class="action-btn edit" onclick="editRule('${rule.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg></button>
                    <button class="action-btn delete" onclick="deleteRule('${rule.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>s</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal Management
function showModal(html) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'adminModal';
    modalOverlay.innerHTML = html;

    document.body.appendChild(modalOverlay);

    // Trigger animation
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            currentEditId = null;
            currentEditType = null;
        }, 300);
    }
}

// League Modal Functions
function showAddLeagueModal() {
    currentEditId = null;
    currentEditType = 'league';

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Create League</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="leagueForm" onsubmit="handleLeagueSubmit(event)">
                    <div class="form-group">
                        <label for="leagueName">Name</label>
                        <input type="text" id="leagueName" placeholder="League name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="leagueDescription">Description</label>
                        <textarea id="leagueDescription" placeholder="League description (optional)"></textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="leagueSport">Sport</label>
                            <input type="text" id="leagueSport" placeholder="e.g., Football" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="leagueSeason">Season</label>
                            <input type="text" id="leagueSeason" placeholder="e.g., 2024-2025" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="leagueStatus">Status</label>
                        <select id="leagueStatus" required>
                            <option value="upcoming">Upcoming</option>
                            <option value="active" selected>Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="leagueForm" class="btn-submit">Create</button>
            </div>
        </div>
    `;

    showModal(html);
}

function editLeague(id) {
    currentEditId = id;
    currentEditType = 'league';

    const league = storage.getLeagues().find(l => l.id === id);
    if (!league) return;

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit League</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="leagueForm" onsubmit="handleLeagueSubmit(event)">
                    <div class="form-group">
                        <label for="leagueName">Name</label>
                        <input type="text" id="leagueName" value="${league.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="leagueDescription">Description</label>
                        <textarea id="leagueDescription">${league.description || ''}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="leagueSport">Sport</label>
                            <input type="text" id="leagueSport" value="${league.sport}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="leagueSeason">Season</label>
                            <input type="text" id="leagueSeason" value="${league.season}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="leagueStatus">Status</label>
                        <select id="leagueStatus" required>
                            <option value="upcoming" ${league.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                            <option value="active" ${league.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="completed" ${league.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="leagueForm" class="btn-submit">Update</button>
            </div>
        </div>
    `;

    showModal(html);
}

function handleLeagueSubmit(event) {
    event.preventDefault();

    const leagueData = {
        name: document.getElementById('leagueName').value,
        description: document.getElementById('leagueDescription').value,
        sport: document.getElementById('leagueSport').value,
        season: document.getElementById('leagueSeason').value,
        status: document.getElementById('leagueStatus').value
    };

    if (currentEditId) {
        storage.updateLeague(currentEditId, leagueData);
    } else {
        storage.addLeague(leagueData);
    }

    closeModal();
    loadLeagues();
}

// Team Modal Functions
function showAddTeamModal() {
    currentEditId = null;
    currentEditType = 'team';

    const league = storage.getActiveLeague();

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Create Team</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="teamForm" onsubmit="handleTeamSubmit(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="teamName">Name</label>
                            <input type="text" id="teamName" placeholder="Team name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="teamShortName">Short Name</label>
                            <input type="text" id="teamShortName" placeholder="e.g., FCB" maxlength="3" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="teamLeague">League</label>
                        <select id="teamLeague" required disabled>
                            <option value="${league.id}" selected>${league.name}</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="teamForm" class="btn-submit">Create</button>
            </div>
        </div>
    `;

    showModal(html);
}

function editTeam(id) {
    currentEditId = id;
    currentEditType = 'team';

    const team = storage.getTeam(id);
    if (!team) return;

    const league = storage.getActiveLeague();

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit Team</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="teamForm" onsubmit="handleTeamSubmit(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="teamName">Name</label>
                            <input type="text" id="teamName" value="${team.name}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="teamShortName">Short Name</label>
                            <input type="text" id="teamShortName" value="${team.code}" maxlength="3" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="teamLeague">League</label>
                        <select id="teamLeague" required>
                            <option value="${league.id}" selected>${league.name}</option>
                        </select>
                    </div>
                    
                    <div class="form-row-3">
                        <div class="form-group">
                            <label for="teamWins">Wins</label>
                            <input type="number" id="teamWins" value="${team.won}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="teamDraws">Draws</label>
                            <input type="number" id="teamDraws" value="${team.drawn}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="teamLosses">Losses</label>
                            <input type="number" id="teamLosses" value="${team.lost}" min="0" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="teamGoalsFor">Goals For</label>
                            <input type="number" id="teamGoalsFor" value="${team.goalsFor}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="teamGoalsAgainst">Goals Against</label>
                            <input type="number" id="teamGoalsAgainst" value="${team.goalsAgainst}" min="0" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="teamForm" class="btn-submit">Update</button>
            </div>
        </div>
    `;

    showModal(html);
}

function handleTeamSubmit(event) {
    event.preventDefault();

    const league = storage.getActiveLeague();

    if (currentEditId) {
        const won = parseInt(document.getElementById('teamWins').value);
        const drawn = parseInt(document.getElementById('teamDraws').value);
        const lost = parseInt(document.getElementById('teamLosses').value);
        const goalsFor = parseInt(document.getElementById('teamGoalsFor').value);
        const goalsAgainst = parseInt(document.getElementById('teamGoalsAgainst').value);

        const teamData = {
            name: document.getElementById('teamName').value,
            code: document.getElementById('teamShortName').value.toUpperCase(),
            leagueId: league.id,
            won: won,
            drawn: drawn,
            lost: lost,
            played: won + drawn + lost,
            goalsFor: goalsFor,
            goalsAgainst: goalsAgainst,
            goalDifference: goalsFor - goalsAgainst,
            points: (won * 3) + drawn
        };

        storage.updateTeam(currentEditId, teamData);
    } else {
        const teamData = {
            name: document.getElementById('teamName').value,
            code: document.getElementById('teamShortName').value.toUpperCase(),
            leagueId: league.id
        };

        storage.addTeam(teamData);
    }

    closeModal();
    loadTeamsAdmin();
}

// Player Modal Functions
function showAddPlayerModal() {
    currentEditId = null;
    currentEditType = 'player';

    const teams = storage.getTeams();
    const positions = ['GK', 'DEF', 'MID', 'FWD'];

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Create Player</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="playerForm" onsubmit="handlePlayerSubmit(event)">
                    <div class="form-group">
                        <label for="playerName">Name</label>
                        <input type="text" id="playerName" placeholder="Player name" required>
                    </div>
                    
                    <div class="form-row-3">
                        <div class="form-group">
                            <label for="playerTeam">Team</label>
                            <select id="playerTeam" required>
                                <option value="">Select team</option>
                                ${teams.map(team => `
                                    <option value="${team.id}">${team.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerPosition">Position</label>
                            <select id="playerPosition" required>
                                <option value="">Select position</option>
                                ${positions.map(pos => `
                                    <option value="${pos}">${pos}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerNumber">Jersey #</label>
                            <input type="number" id="playerNumber" min="1" max="99" value="1" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="playerForm" class="btn-submit">Create</button>
            </div>
        </div>
    `;

    showModal(html);
}

function editPlayer(id) {
    currentEditId = id;
    currentEditType = 'player';

    const player = storage.getPlayer(id);
    if (!player) return;

    const teams = storage.getTeams();
    const positions = ['GK', 'DEF', 'MID', 'FWD'];

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit Player</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="playerForm" onsubmit="handlePlayerSubmit(event)">
                    <div class="form-group">
                        <label for="playerName">Name</label>
                        <input type="text" id="playerName" value="${player.name}" required>
                    </div>
                    
                    <div class="form-row-3">
                        <div class="form-group">
                            <label for="playerTeam">Team</label>
                            <select id="playerTeam" required>
                                ${teams.map(team => `
                                    <option value="${team.id}" ${team.id === player.teamId ? 'selected' : ''}>${team.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerPosition">Position</label>
                            <select id="playerPosition" required>
                                ${positions.map(pos => `
                                    <option value="${pos}" ${pos === player.position ? 'selected' : ''}>${pos}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerNumber">Jersey #</label>
                            <input type="number" id="playerNumber" value="${player.number}" min="1" max="99" required>
                        </div>
                    </div>
                    
                    <div class="form-row-3">
                        <div class="form-group">
                            <label for="playerGames">Games Played</label>
                            <input type="number" id="playerGames" value="${player.gamesPlayed}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerGoals">Goals</label>
                            <input type="number" id="playerGoals" value="${player.goals}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerAssists">Assists</label>
                            <input type="number" id="playerAssists" value="${player.assists}" min="0" required>
                        </div>
                    </div>
                    
                    <div class="form-row-3">
                        <div class="form-group">
                            <label for="playerYellow">Yellow Cards</label>
                            <input type="number" id="playerYellow" value="${player.yellowCards}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerRed">Red Cards</label>
                            <input type="number" id="playerRed" value="${player.redCards}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="playerFantasy">Fantasy Points</label>
                            <input type="number" id="playerFantasy" value="${player.fantasyPoints}" min="0" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="playerForm" class="btn-submit">Update</button>
            </div>
        </div>
    `;

    showModal(html);
}

function handlePlayerSubmit(event) {
    event.preventDefault();

    const playerData = {
        name: document.getElementById('playerName').value,
        teamId: document.getElementById('playerTeam').value,
        position: document.getElementById('playerPosition').value,
        number: parseInt(document.getElementById('playerNumber').value)
    };

    if (currentEditId) {
        playerData.gamesPlayed = parseInt(document.getElementById('playerGames').value);
        playerData.goals = parseInt(document.getElementById('playerGoals').value);
        playerData.assists = parseInt(document.getElementById('playerAssists').value);
        playerData.yellowCards = parseInt(document.getElementById('playerYellow').value);
        playerData.redCards = parseInt(document.getElementById('playerRed').value);
        playerData.fantasyPoints = parseInt(document.getElementById('playerFantasy').value);

        storage.updatePlayer(currentEditId, playerData);
    } else {
        storage.addPlayer(playerData);
    }

    closeModal();
    loadPlayersAdmin();
}

// Match Modal Functions
function showAddMatchModal() {
    currentEditId = null;
    currentEditType = 'match';

    const league = storage.getActiveLeague();
    const teams = storage.getTeams(league.id);

    // Get current date and time in local format
    const now = new Date();
    const dateString = now.toISOString().slice(0, 16);

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Create Match</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="matchForm" onsubmit="handleMatchSubmit(event)">
                    <div class="form-group">
                        <label for="matchLeague">League</label>
                        <select id="matchLeague" required disabled>
                            <option value="${league.id}" selected>${league.name}</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchHome">Home Team</label>
                            <select id="matchHome" required>
                                <option value="">Select home team</option>
                                ${teams.map(team => `
                                    <option value="${team.id}">${team.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="matchAway">Away Team</label>
                            <select id="matchAway" required>
                                <option value="">Select away team</option>
                                ${teams.map(team => `
                                    <option value="${team.id}">${team.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchDateTime">Date & Time</label>
                            <input type="datetime-local" id="matchDateTime" value="${dateString}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="matchRound">Round</label>
                            <input type="number" id="matchRound" min="1" value="1" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchVenue">Venue (Optional)</label>
                            <input type="text" id="matchVenue" placeholder="Stadium name">
                        </div>
                        
                        <div class="form-group">
                            <label for="matchStatus">Status</label>
                            <select id="matchStatus" required>
                                <option value="scheduled" selected>Scheduled</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="matchForm" class="btn-submit">Create</button>
            </div>
        </div>
    `;

    showModal(html);
}

function editMatch(id) {
    currentEditId = id;
    currentEditType = 'match';

    const match = storage.getMatch(id);
    if (!match) return;

    const league = storage.getActiveLeague();
    const teams = storage.getTeams(league.id);

    // Format datetime for input
    const dateTime = new Date(match.date + 'T' + (match.time || '00:00'));
    const dateString = dateTime.toISOString().slice(0, 16);

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit Match</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="matchForm" onsubmit="handleMatchSubmit(event)">
                    <div class="form-group">
                        <label for="matchLeague">League</label>
                        <select id="matchLeague" required disabled>
                            <option value="${league.id}" selected>${league.name}</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchHome">Home Team</label>
                            <select id="matchHome" required>
                                ${teams.map(team => `
                                    <option value="${team.id}" ${team.id === match.homeTeam ? 'selected' : ''}>${team.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="matchAway">Away Team</label>
                            <select id="matchAway" required>
                                ${teams.map(team => `
                                    <option value="${team.id}" ${team.id === match.awayTeam ? 'selected' : ''}>${team.name}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    
                    ${match.status === 'completed' ? `
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchHomeScore">Home Score</label>
                            <input type="number" id="matchHomeScore" value="${match.homeScore || 0}" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="matchAwayScore">Away Score</label>
                            <input type="number" id="matchAwayScore" value="${match.awayScore || 0}" min="0" required>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchDateTime">Date & Time</label>
                            <input type="datetime-local" id="matchDateTime" value="${dateString}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="matchRound">Round</label>
                            <input type="number" id="matchRound" value="${match.round}" min="1" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="matchVenue">Venue (Optional)</label>
                            <input type="text" id="matchVenue" value="${match.venue || ''}" placeholder="Stadium name">
                        </div>
                        
                        <div class="form-group">
                            <label for="matchStatus">Status</label>
                            <select id="matchStatus" required>
                                <option value="scheduled" ${match.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                                <option value="live" ${match.status === 'live' ? 'selected' : ''}>Live</option>
                                <option value="completed" ${match.status === 'completed' ? 'selected' : ''}>Completed</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="matchForm" class="btn-submit">Update</button>
            </div>
        </div>
    `;

    showModal(html);
}

function handleMatchSubmit(event) {
    event.preventDefault();

    const league = storage.getActiveLeague();
    const dateTime = new Date(document.getElementById('matchDateTime').value);

    const matchData = {
        leagueId: league.id,
        homeTeam: document.getElementById('matchHome').value,
        awayTeam: document.getElementById('matchAway').value,
        date: dateTime.toISOString().split('T')[0],
        time: dateTime.toTimeString().slice(0, 5),
        round: parseInt(document.getElementById('matchRound').value),
        venue: document.getElementById('matchVenue').value,
        status: document.getElementById('matchStatus').value
    };

    if (currentEditId && matchData.status === 'completed') {
        matchData.homeScore = parseInt(document.getElementById('matchHomeScore').value);
        matchData.awayScore = parseInt(document.getElementById('matchAwayScore').value);
    }

    if (currentEditId) {
        storage.updateMatch(currentEditId, matchData);
    } else {
        storage.addMatch(matchData);
    }

    closeModal();
    loadMatchesAdmin();
}

// Rule Modal Functions
function showAddRuleModal() {
    currentEditId = null;
    currentEditType = 'rule';

    const league = storage.getActiveLeague();

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Create Rule</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="ruleForm" onsubmit="handleRuleSubmit(event)">
                    <div class="form-group">
                        <label for="ruleLeague">League</label>
                        <select id="ruleLeague" required disabled>
                            <option value="${league.id}" selected>${league.name}</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ruleTitle">Title</label>
                        <input type="text" id="ruleTitle" placeholder="Rule title" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="ruleDescription">Description</label>
                        <textarea id="ruleDescription" placeholder="Rule description" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="ruleOrder">Order Index</label>
                        <input type="number" id="ruleOrder" min="0" value="0" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="ruleForm" class="btn-submit">Create</button>
            </div>
        </div>
    `;

    showModal(html);
}

function editRule(id) {
    currentEditId = id;
    currentEditType = 'rule';

    const rule = storage.getRules().find(r => r.id === id);
    if (!rule) return;

    const league = storage.getActiveLeague();

    const html = `
        <div class="modal-container">
            <div class="modal-header">
                <h2>Edit Rule</h2>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <form id="ruleForm" onsubmit="handleRuleSubmit(event)">
                    <div class="form-group">
                        <label for="ruleLeague">League</label>
                        <select id="ruleLeague" required disabled>
                            <option value="${league.id}" selected>${league.name}</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ruleTitle">Title</label>
                        <input type="text" id="ruleTitle" value="${rule.title}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="ruleDescription">Description</label>
                        <textarea id="ruleDescription" required>${rule.description || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="ruleOrder">Order Index</label>
                        <input type="number" id="ruleOrder" value="${rule.order || 0}" min="0" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" form="ruleForm" class="btn-submit">Update</button>
            </div>
        </div>
    `;

    showModal(html);
}

function handleRuleSubmit(event) {
    event.preventDefault();

    const league = storage.getActiveLeague();

    const ruleData = {
        leagueId: league.id,
        title: document.getElementById('ruleTitle').value,
        description: document.getElementById('ruleDescription').value,
        order: parseInt(document.getElementById('ruleOrder').value)
    };

    if (currentEditId) {
        storage.updateRule(currentEditId, ruleData);
    } else {
        storage.addRule(ruleData);
    }

    closeModal();
    loadRulesAdmin();
}

// Delete functions
function deleteLeague(id) {
    if (confirm('Are you sure you want to delete this league? This cannot be undone.')) {
        storage.deleteLeague(id);
        loadLeagues();
    }
}

function deleteTeam(id) {
    if (confirm('Are you sure you want to delete this team? This will also delete all its players.')) {
        storage.deleteTeam(id);
        loadTeamsAdmin();
        loadPlayersAdmin();
    }
}

function deletePlayer(id) {
    if (confirm('Are you sure you want to delete this player?')) {
        storage.deletePlayer(id);
        loadPlayersAdmin();
    }
}

function deleteMatch(id) {
    if (confirm('Are you sure you want to delete this match?')) {
        storage.deleteMatch(id);
        loadMatchesAdmin();
    }
}

function deleteRule(id) {
    if (confirm('Are you sure you want to delete this rule?')) {
        storage.deleteRule(id);
        loadRulesAdmin();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Edit Match Function
function editMatch(id) {
    const match = storage.getMatch(id);
    const homeTeam = storage.getTeam(match.homeTeam);
    const awayTeam = storage.getTeam(match.awayTeam);
    
    const html = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Edit Match</h2>
                <button class="modal-close" onclick="closeEditMatchModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Match</label>
                    <div style="padding: 12px; background: var(--bg-tertiary); border-radius: 8px; margin-bottom: 16px;">
                        <strong>${homeTeam.name}</strong> vs <strong>${awayTeam.name}</strong>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="matchStatus">Status</label>
                    <select id="matchStatus" style="width: 100%; padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-family: inherit;">
                        <option value="scheduled" ${match.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="live" ${match.status === 'live' ? 'selected' : ''}>Live</option>
                        <option value="completed" ${match.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div class="form-group">
                        <label for="homeScore">${homeTeam.name} Score</label>
                        <input type="number" id="homeScore" value="${match.homeScore || 0}" min="0" style="width: 100%; padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-family: inherit;">
                    </div>
                    
                    <div class="form-group">
                        <label for="awayScore">${awayTeam.name} Score</label>
                        <input type="number" id="awayScore" value="${match.awayScore || 0}" min="0" style="width: 100%; padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-family: inherit;">
                    </div>
                </div>
                
                <div style="display: flex; gap: 16px; margin-top: 24px;">
                    <button onclick="closeEditMatchModal()" class="btn btn-secondary" style="flex: 1;">Cancel</button>
                    <button onclick="saveMatchEdit('${id}')" class="btn btn-primary" style="flex: 1;">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'editMatchModal';
    modal.innerHTML = html;
    modal.onclick = function(e) {
        if (e.target === modal) closeEditMatchModal();
    };
    document.body.appendChild(modal);
}

function closeEditMatchModal() {
    const modal = document.getElementById('editMatchModal');
    if (modal) modal.remove();
}

function saveMatchEdit(matchId) {
    const status = document.getElementById('matchStatus').value;
    const homeScore = parseInt(document.getElementById('homeScore').value) || 0;
    const awayScore = parseInt(document.getElementById('awayScore').value) || 0;
    
    const updateData = {
        status: status,
        homeScore: homeScore,
        awayScore: awayScore
    };
    
    storage.updateMatch(matchId, updateData);
    closeEditMatchModal();
    loadMatchesAdmin();
    alert('Match updated successfully!');
}

// Matches page functionality
let currentTab = 'all';

document.addEventListener('DOMContentLoaded', function () {
    loadFilters();
    loadMatches();
});

function loadFilters() {
    const league = storage.getActiveLeague();
    const teams = storage.getTeams(league.id);
    const matches = storage.getMatches(league.id);

    // Load team filter
    const teamFilter = document.getElementById('teamFilter');
    teamFilter.innerHTML = '<option value="">All Teams</option>' +
        teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');

    // Load round filter
    const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
    const roundFilter = document.getElementById('roundFilter');
    roundFilter.innerHTML = '<option value="">All Rounds</option>' +
        rounds.map(round => `<option value="${round}">Round ${round}</option>`).join('');
}

function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    loadMatches();
}

function filterMatches() {
    loadMatches();
}

function loadMatches() {
    const league = storage.getActiveLeague();
    let matches = storage.getMatches(league.id);

    // Apply tab filter
    if (currentTab === 'results') {
        matches = matches.filter(m => m.status === 'completed');
    } else if (currentTab === 'fixtures') {
        matches = matches.filter(m => m.status === 'scheduled');
    }

    // Apply team filter
    const teamFilter = document.getElementById('teamFilter').value;
    if (teamFilter) {
        matches = matches.filter(m => m.homeTeam === teamFilter || m.awayTeam === teamFilter);
    }

    // Apply round filter
    const roundFilter = document.getElementById('roundFilter').value;
    if (roundFilter) {
        matches = matches.filter(m => m.round === parseInt(roundFilter));
    }

    renderMatches(matches);
}

function renderMatches(matches) {
    const container = document.getElementById('matchesContainer');

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="empty-matches">
                <svg viewBox="0 0 64 64" fill="currentColor">
                    <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                </svg>
                <h3>No Matches Found</h3>
                <p>There are no matches matching your filters</p>
            </div>
        `;
        return;
    }

    // Group matches by round
    const matchesByRound = {};
    matches.forEach(match => {
        if (!matchesByRound[match.round]) {
            matchesByRound[match.round] = [];
        }
        matchesByRound[match.round].push(match);
    });

    // Sort rounds
    const rounds = Object.keys(matchesByRound).sort((a, b) => parseInt(b) - parseInt(a));

    container.innerHTML = rounds.map(round => {
        const roundMatches = matchesByRound[round];
        const completed = roundMatches.filter(m => m.status === 'completed').length;
        const total = roundMatches.length;

        return `
            <div class="round-section">
                <div class="round-header">
                    <h3>Round ${round}</h3>
                    <span class="round-completion">${completed}/${total} completed</span>
                </div>
                <div class="round-matches">
                    ${roundMatches.map(match => renderMatchCard(match)).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderMatchCard(match) {
    const homeTeam = storage.getTeam(match.homeTeam);
    const awayTeam = storage.getTeam(match.awayTeam);

    const homeWinner = match.status === 'completed' && match.homeScore > match.awayScore;
    const awayWinner = match.status === 'completed' && match.awayScore > match.homeScore;

    return `
        <div class="match-card">
            <div class="match-card-header">
                <span class="match-status-badge ${match.status}">${match.status.toUpperCase()}</span>
                <span class="match-round">Round ${match.round}</span>
            </div>
            
            <div class="match-teams-container">
                <div class="match-team ${homeWinner ? 'winner' : ''}">
                    <div class="match-team-badge">${homeTeam.code}</div>
                    <div class="match-team-info">
                        <span class="match-team-name">${homeTeam.name}</span>
                        <span class="match-team-code">${homeTeam.code}</span>
                    </div>
                </div>
                
                <div class="match-score-container">
                    ${match.status === 'completed' ? `
                        <div class="match-score">
                            <span class="team-score ${homeWinner ? 'winner' : ''}">${match.homeScore}</span>
                            <span class="score-separator">-</span>
                            <span class="team-score ${awayWinner ? 'winner' : ''}">${match.awayScore}</span>
                        </div>
                    ` : `
                        <span class="match-vs">VS</span>
                    `}
                </div>
                
                <div class="match-team away ${awayWinner ? 'winner' : ''}">
                    <div class="match-team-badge">${awayTeam.code}</div>
                    <div class="match-team-info">
                        <span class="match-team-name">${awayTeam.name}</span>
                        <span class="match-team-code">${awayTeam.code}</span>
                    </div>
                </div>
            </div>
            
            <div class="match-footer">
                <div class="match-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                            class="bi bi-calendar-date" viewBox="0 0 16 16">
                            <path
                                d="M6.445 11.688V6.354h-.633A13 13 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23" />
                            <path
                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                        </svg>
                    <span>${formatDate(match.date)}</span>
                </div>
                <div class="match-info-item match-time">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="8" r="7"/>
                        <path d="M8 4v4l3 2" stroke="white" stroke-width="1.5" fill="none"/>
                    </svg>
                    <span>${match.time}</span>
                </div>
                <div class="match-info-item">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2L3 6v7h10V6L8 2zm0 2l3 3v5H5V7l3-3z"/>
                    </svg>
                    <span>${match.venue}</span>
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

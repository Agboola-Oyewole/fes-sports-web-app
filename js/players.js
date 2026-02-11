// Players page functionality
let currentTab = 'all';
let currentSort = 'goals';
let sortOrder = 'desc';

document.addEventListener('DOMContentLoaded', function() {
    loadTeamFilter();
    loadPlayers();
});

function loadTeamFilter() {
    const league = storage.getActiveLeague();
    const teams = storage.getTeams(league.id);
    const filter = document.getElementById('teamFilter');
    
    filter.innerHTML = '<option value="">All Teams</option>' + 
        teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    
    // Load appropriate data
    loadPlayers();
}

function loadPlayers() {
    let players = storage.getPlayers();
    
    // Apply filters
    const teamFilter = document.getElementById('teamFilter').value;
    const positionFilter = document.getElementById('positionFilter').value;
    const searchTerm = document.getElementById('searchPlayer').value.toLowerCase();
    
    if (teamFilter) {
        players = players.filter(p => p.teamId === teamFilter);
    }
    
    if (positionFilter) {
        players = players.filter(p => p.position === positionFilter);
    }
    
    if (searchTerm) {
        players = players.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    
    // Apply tab-specific sorting
    switch(currentTab) {
        case 'scorers':
            players.sort((a, b) => {
                if (b.goals !== a.goals) return b.goals - a.goals;
                return b.assists - a.assists;
            });
            break;
        case 'assists':
            players.sort((a, b) => {
                if (b.assists !== a.assists) return b.assists - a.assists;
                return b.goals - a.goals;
            });
            break;
        case 'fantasy':
            players.sort((a, b) => b.fantasyPoints - a.fantasyPoints);
            break;
        default:
            sortPlayers(currentSort, false);
            return;
    }
    
    renderPlayers(players);
}

function sortPlayers(column, toggle = true) {
    if (toggle) {
        if (currentSort === column) {
            sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
        } else {
            currentSort = column;
            sortOrder = 'desc';
        }
    }
    
    let players = storage.getPlayers();
    
    // Apply current filters
    const teamFilter = document.getElementById('teamFilter').value;
    const positionFilter = document.getElementById('positionFilter').value;
    const searchTerm = document.getElementById('searchPlayer').value.toLowerCase();
    
    if (teamFilter) players = players.filter(p => p.teamId === teamFilter);
    if (positionFilter) players = players.filter(p => p.position === positionFilter);
    if (searchTerm) players = players.filter(p => p.name.toLowerCase().includes(searchTerm));
    
    // Sort
    players.sort((a, b) => {
        const aVal = a[column] || 0;
        const bVal = b[column] || 0;
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
    });
    
    renderPlayers(players);
}

function renderPlayers(players) {
    const tbody = document.getElementById('playersTableBody');
    
    if (players.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    <div class="empty-players">
                        <svg viewBox="0 0 64 64" fill="currentColor" style="width: 64px; height: 64px; margin: 0 auto var(--spacing-md); opacity: 0.3;">
                            <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11.1 0 20 8.9 20 20s-8.9 20-20 20-20-8.9-20-20 8.9-20 20-20z"/>
                        </svg>
                        <h3>No Players Found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = players.map((player, index) => {
        const team = storage.getTeam(player.teamId);
        
        return `
            <tr>
                <td class="player-rank">${index + 1}</td>
                <td>
                    <div class="player-info">
                        <div class="player-jersey">#${player.number}</div>
                        <div class="player-details">
                            <span class="player-name">${player.name}</span>
                            <span class="player-meta">${player.gamesPlayed} games played</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="team-badge-small">${team.code}</span>
                </td>
                <td style="text-align: center;">
                    <span class="position-badge ${player.position.toLowerCase()}">${player.position}</span>
                </td>
                <td class="stat">${player.gamesPlayed}</td>
                <td class="stat stat-goals">${player.goals}</td>
                <td class="stat stat-assists">${player.assists}</td>
                <td class="stat stat-yellow">${player.yellowCards}</td>
                <td class="stat stat-red">${player.redCards}</td>
                <td class="stat stat-fantasy">${player.fantasyPoints}</td>
            </tr>
        `;
    }).join('');
}

function filterPlayers() {
    loadPlayers();
}

// Storage abstraction layer - can be swapped for Firebase later
class DataStorage {
    constructor() {
        this.storageKey = 'fes_sports_data';
        this.initializeData();
    }

    // Initialize default data structure
    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultData = {
                leagues: [{
                    id: 'fes-league-2025',
                    name: 'FES League',
                    sport: 'Football',
                    season: '2025/2026',
                    status: 'active',
                    teams: 3,
                    created: new Date().toISOString()
                }],
                teams: [
                    {
                        id: 'ELT',
                        name: 'Elites',
                        code: 'ELT',
                        played: 3,
                        won: 3,
                        drawn: 0,
                        lost: 0,
                        goalsFor: 10,
                        goalsAgainst: 1,
                        goalDifference: 9,
                        points: 9,
                        form: ['W', 'W', 'W'],
                        leagueId: 'fes-league-2025'
                    },
                    {
                        id: 'CRD',
                        name: 'Creeds',
                        code: 'CRD',
                        played: 2,
                        won: 2,
                        drawn: 0,
                        lost: 0,
                        goalsFor: 6,
                        goalsAgainst: 2,
                        goalDifference: 4,
                        points: 6,
                        form: ['W', 'W'],
                        leagueId: 'fes-league-2025'
                    },
                    {
                        id: 'RAI',
                        name: 'Raiders',
                        code: 'RAI',
                        played: 3,
                        won: 1,
                        drawn: 0,
                        lost: 2,
                        goalsFor: 4,
                        goalsAgainst: 5,
                        goalDifference: -1,
                        points: 3,
                        form: ['L', 'W', 'L'],
                        leagueId: 'fes-league-2025'
                    }
                ],
                players: [
                    { id: 'p1', name: 'Afo', number: 2, position: 'DEF', teamId: 'CRD', goals: 0, assists: 0, yellowCards: 0, redCards: 0, gamesPlayed: 2, fantasyPoints: 0 },
                    { id: 'p2', name: 'Cityboi', number: 11, position: 'FWD', teamId: 'CRD', goals: 2, assists: 0, yellowCards: 0, redCards: 0, gamesPlayed: 2, fantasyPoints: 0 },
                    { id: 'p3', name: 'Damian', number: 10, position: 'FWD', teamId: 'CRD', goals: 0, assists: 0, yellowCards: 0, redCards: 0, gamesPlayed: 2, fantasyPoints: 0 },
                    { id: 'p4', name: 'Delmar', number: 21, position: 'FWD', teamId: 'CRD', goals: 0, assists: 1, yellowCards: 0, redCards: 0, gamesPlayed: 2, fantasyPoints: 0 },
                    { id: 'p5', name: 'Itachi', number: 7, position: 'MID', teamId: 'CRD', goals: 3, assists: 0, yellowCards: 0, redCards: 0, gamesPlayed: 2, fantasyPoints: 0 },
                    { id: 'p6', name: 'Miisha', number: 4, position: 'MID', teamId: 'CRD', goals: 1, assists: 2, yellowCards: 0, redCards: 0, gamesPlayed: 2, fantasyPoints: 0 }
                ],
                matches: [
                    {
                        id: 'm1',
                        round: 1,
                        homeTeam: 'RAI',
                        awayTeam: 'CRD',
                        homeScore: 2,
                        awayScore: 3,
                        status: 'completed',
                        date: '2026-02-05',
                        time: '10:00',
                        venue: 'Sandy Pitch',
                        leagueId: 'fes-league-2025'
                    },
                    {
                        id: 'm2',
                        round: 4,
                        homeTeam: 'CRD',
                        awayTeam: 'ELT',
                        homeScore: null,
                        awayScore: null,
                        status: 'scheduled',
                        date: '2026-02-12',
                        time: '10:00',
                        venue: 'Sandy Pitch',
                        leagueId: 'fes-league-2025'
                    }
                ],
                rules: [],
                brackets: {
                    teams: 3,
                    rounds: 3,
                    status: 'upcoming',
                    seeding: [
                        { seed: 1, teamId: 'ELT', points: 9 },
                        { seed: 2, teamId: 'CRD', points: 6 },
                        { seed: 3, teamId: 'RAI', points: 3 }
                    ],
                    quarterFinals: [
                        { match: 1, team1: 'ELT', team2: 'TBD', winner: null },
                        { match: 2, team1: 'CRD', team2: 'TBD', winner: null },
                        { match: 3, team1: 'TBD', team2: 'TBD', winner: null },
                        { match: 4, team1: 'TBD', team2: 'TBD', winner: null }
                    ]
                },
                fantasy: {
                    enabled: false,
                    teams: []
                }
            };
            
            this.saveData(defaultData);
        }
    }

    // Get all data
    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    // Save all data
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // League operations
    getLeagues() {
        return this.getData().leagues || [];
    }

    getActiveLeague() {
        const leagues = this.getLeagues();
        return leagues.find(l => l.status === 'active') || leagues[0];
    }

    addLeague(league) {
        const data = this.getData();
        league.id = `league-${Date.now()}`;
        league.created = new Date().toISOString();
        data.leagues.push(league);
        this.saveData(data);
        return league;
    }

    updateLeague(leagueId, updates) {
        const data = this.getData();
        const index = data.leagues.findIndex(l => l.id === leagueId);
        if (index !== -1) {
            data.leagues[index] = { ...data.leagues[index], ...updates };
            this.saveData(data);
            return data.leagues[index];
        }
        return null;
    }

    deleteLeague(leagueId) {
        const data = this.getData();
        data.leagues = data.leagues.filter(l => l.id !== leagueId);
        this.saveData(data);
    }

    // Team operations
    getTeams(leagueId = null) {
        const teams = this.getData().teams || [];
        if (leagueId) {
            return teams.filter(t => t.leagueId === leagueId);
        }
        return teams;
    }

    getTeam(teamId) {
        return this.getTeams().find(t => t.id === teamId);
    }

    addTeam(team) {
        const data = this.getData();
        team.id = team.code || `team-${Date.now()}`;
        team.played = 0;
        team.won = 0;
        team.drawn = 0;
        team.lost = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
        team.goalDifference = 0;
        team.points = 0;
        team.form = [];
        data.teams.push(team);
        this.saveData(data);
        return team;
    }

    updateTeam(teamId, updates) {
        const data = this.getData();
        const index = data.teams.findIndex(t => t.id === teamId);
        if (index !== -1) {
            data.teams[index] = { ...data.teams[index], ...updates };
            this.saveData(data);
            return data.teams[index];
        }
        return null;
    }

    deleteTeam(teamId) {
        const data = this.getData();
        data.teams = data.teams.filter(t => t.id !== teamId);
        // Also delete team's players
        data.players = data.players.filter(p => p.teamId !== teamId);
        this.saveData(data);
    }

    // Player operations
    getPlayers(teamId = null) {
        const players = this.getData().players || [];
        if (teamId) {
            return players.filter(p => p.teamId === teamId);
        }
        return players;
    }

    getPlayer(playerId) {
        return this.getPlayers().find(p => p.id === playerId);
    }

    addPlayer(player) {
        const data = this.getData();
        player.id = `player-${Date.now()}`;
        player.goals = 0;
        player.assists = 0;
        player.yellowCards = 0;
        player.redCards = 0;
        player.gamesPlayed = 0;
        player.fantasyPoints = 0;
        data.players.push(player);
        this.saveData(data);
        return player;
    }

    updatePlayer(playerId, updates) {
        const data = this.getData();
        const index = data.players.findIndex(p => p.id === playerId);
        if (index !== -1) {
            data.players[index] = { ...data.players[index], ...updates };
            this.saveData(data);
            return data.players[index];
        }
        return null;
    }

    deletePlayer(playerId) {
        const data = this.getData();
        data.players = data.players.filter(p => p.id !== playerId);
        this.saveData(data);
    }

    // Match operations
    getMatches(leagueId = null) {
        const matches = this.getData().matches || [];
        if (leagueId) {
            return matches.filter(m => m.leagueId === leagueId);
        }
        return matches;
    }

    getMatch(matchId) {
        return this.getMatches().find(m => m.id === matchId);
    }

    addMatch(match) {
        const data = this.getData();
        match.id = `match-${Date.now()}`;
        match.homeScore = null;
        match.awayScore = null;
        match.status = 'scheduled';
        data.matches.push(match);
        this.saveData(data);
        return match;
    }

    updateMatch(matchId, updates) {
        const data = this.getData();
        const index = data.matches.findIndex(m => m.id === matchId);
        if (index !== -1) {
            data.matches[index] = { ...data.matches[index], ...updates };
            
            // If match is completed, update team standings
            if (updates.status === 'completed' && updates.homeScore !== null && updates.awayScore !== null) {
                this.updateStandingsFromMatch(data.matches[index]);
            }
            
            this.saveData(data);
            return data.matches[index];
        }
        return null;
    }

    deleteMatch(matchId) {
        const data = this.getData();
        data.matches = data.matches.filter(m => m.id !== matchId);
        this.saveData(data);
    }

    // Update standings based on match result
    updateStandingsFromMatch(match) {
        const data = this.getData();
        const homeTeam = data.teams.find(t => t.id === match.homeTeam);
        const awayTeam = data.teams.find(t => t.id === match.awayTeam);
        
        if (!homeTeam || !awayTeam) return;
        
        // Update goals
        homeTeam.goalsFor += match.homeScore;
        homeTeam.goalsAgainst += match.awayScore;
        awayTeam.goalsFor += match.awayScore;
        awayTeam.goalsAgainst += match.homeScore;
        
        // Update goal difference
        homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
        awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
        
        // Update matches played
        homeTeam.played++;
        awayTeam.played++;
        
        // Determine result and update form
        if (match.homeScore > match.awayScore) {
            homeTeam.won++;
            homeTeam.points += 3;
            homeTeam.form.unshift('W');
            
            awayTeam.lost++;
            awayTeam.form.unshift('L');
        } else if (match.homeScore < match.awayScore) {
            awayTeam.won++;
            awayTeam.points += 3;
            awayTeam.form.unshift('W');
            
            homeTeam.lost++;
            homeTeam.form.unshift('L');
        } else {
            homeTeam.drawn++;
            homeTeam.points++;
            homeTeam.form.unshift('D');
            
            awayTeam.drawn++;
            awayTeam.points++;
            awayTeam.form.unshift('D');
        }
        
        // Keep only last 5 form results
        homeTeam.form = homeTeam.form.slice(0, 5);
        awayTeam.form = awayTeam.form.slice(0, 5);
        
        this.saveData(data);
    }

    // Get standings sorted by points, goal difference, goals for
    getStandings(leagueId) {
        const teams = this.getTeams(leagueId);
        return teams.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });
    }

    // Rule operations
    getRules(leagueId = null) {
        const rules = this.getData().rules || [];
        if (leagueId) {
            return rules.filter(r => r.leagueId === leagueId);
        }
        return rules;
    }

    addRule(rule) {
        const data = this.getData();
        rule.id = `rule-${Date.now()}`;
        rule.created = new Date().toISOString();
        data.rules.push(rule);
        this.saveData(data);
        return rule;
    }

    updateRule(ruleId, updates) {
        const data = this.getData();
        const index = data.rules.findIndex(r => r.id === ruleId);
        if (index !== -1) {
            data.rules[index] = { ...data.rules[index], ...updates };
            this.saveData(data);
            return data.rules[index];
        }
        return null;
    }

    deleteRule(ruleId) {
        const data = this.getData();
        data.rules = data.rules.filter(r => r.id !== ruleId);
        this.saveData(data);
    }

    // Bracket operations
    getBrackets() {
        return this.getData().brackets || {};
    }

    updateBrackets(brackets) {
        const data = this.getData();
        data.brackets = brackets;
        this.saveData(data);
    }

    // Fantasy operations
    getFantasy() {
        return this.getData().fantasy || { enabled: false, teams: [] };
    }

    updateFantasy(fantasy) {
        const data = this.getData();
        data.fantasy = fantasy;
        this.saveData(data);
    }

    // Clear all data
    clearData() {
        localStorage.removeItem(this.storageKey);
        this.initializeData();
    }

    // Export data
    exportData() {
        return JSON.stringify(this.getData(), null, 2);
    }

    // Import data
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.saveData(data);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Initialize storage
const storage = new DataStorage();

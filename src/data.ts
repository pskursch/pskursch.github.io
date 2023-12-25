export interface Round {
    label: string;
    index: number;
    successfulDarts: Array<SuccessfulDart>
}

export interface SuccessfulDart {
    score: number
}

export interface Team {
    id: string;
    name: string;
    scoreboard: Scoreboard;
    numberOfPlayers: number;
    throwIndex: number;
    rounds: Array<Round>
}

export interface ScoreboardRow {
    label: string;
    index: number;
}

export interface Scoreboard {
    id: string;
    name: string;
}

export const roundToIndexMap = new Map<string, number>;
roundToIndexMap.set("15", 0);
roundToIndexMap.set("16", 1);
roundToIndexMap.set("D", 2);
roundToIndexMap.set("17", 3);
roundToIndexMap.set("18", 4);
roundToIndexMap.set("41", 5);
roundToIndexMap.set("19", 6);
roundToIndexMap.set("20", 7);
roundToIndexMap.set("B", 8);

export const useGetTeams = (scoreboard: Scoreboard): Array<Team> => {
    const teamsStr = localStorage.getItem("lumberjack.teams");
    if (!teamsStr) {
        return [];
    }
    const teams: Array<Team> = JSON.parse(teamsStr);
    return teams.filter(t => t.scoreboard.id === scoreboard.id);
}

export const createTeam = (name: string, numberOfPlayers: number, throwIndex: number, scoreboard: Scoreboard): Team => {
    const id = generateUniqueId();
    const teamsStr = localStorage.getItem("lumberjack.teams");
    let teams: Array<Team> = [];
    if (teamsStr) {
        teams = JSON.parse(teamsStr) as Array<Team>;
    }
    const newTeam: Team = {id: id, name: name, numberOfPlayers: numberOfPlayers, throwIndex: throwIndex, scoreboard: scoreboard, rounds: []}
    teams.push(newTeam);
    localStorage.setItem("lumberjack.teams", JSON.stringify(teams));
    return newTeam;
}

export const generateUniqueId = (): string => {
    const timestamp: number = new Date().getTime();
    const random: number = Math.floor(Math.random() * 1000000);
    return `${timestamp}${random}`;
}

export const createScoreboard = (name: string): Scoreboard => {
    const id = generateUniqueId();
    const scoreboard: Scoreboard = {id: id, name: name};
    const oldScoreboardStr = localStorage.getItem("lumberjack.scoreboards");
    let newScoreboards: Array<Scoreboard> = [scoreboard];
    if (oldScoreboardStr) {
        const oldScoreboards: Array<Scoreboard> = JSON.parse(oldScoreboardStr);
        newScoreboards = newScoreboards.concat(oldScoreboards);
    }
    localStorage.setItem("lumberjack.scoreboards", JSON.stringify(newScoreboards));
    return scoreboard;
}


export const useGetScoreboards = () => {
    const scoreboards = localStorage.getItem("lumberjack.scoreboards");
    if (scoreboards === null) {
        return [] as Array<Scoreboard>
    }
    return JSON.parse(scoreboards) as Array<Scoreboard>
}

export const useGetScoreboard = (id: string): Scoreboard | undefined => {
    const scoreboards = useGetScoreboards();
    if (!scoreboards || scoreboards.length === 0) {
        return undefined
    }
    return scoreboards.filter(sb => sb.id === id)[0];
}

export const getRoundScoreForTeam = (team: Team, roundLabel: string) => {
    const index = roundToIndexMap.get(roundLabel);
    if (!index && index != 0) {
        return undefined;
    }
    const teamHasCompletedRound = team.rounds.filter(r => r.label === roundLabel).length > 0;
    if (!teamHasCompletedRound) {
        return undefined;
    }
    let score = 0;
    team.rounds.forEach(round => {
        if (round.index <= index) {
            if (round.successfulDarts.length > 0) {
                round.successfulDarts.forEach(successfulDart => {
                    score = score + successfulDart.score
                })
            } else if (score > 0) {
                score = Math.round(score / 2);
            }
        }
    })
    return score;
}

export const setRoundForTeam = (team: Team, round: Round) => {
    const teamsStr = localStorage.getItem("lumberjack.teams");
    if (!teamsStr) {
        return;
    }
    const editRound = team.rounds.filter(r => r.label === round.label).length > 0;

    if (editRound) {
        team.rounds = team.rounds.map((r) => {
            if (r.label === round.label) {
                return round;
            }
            return r;
        })
    } else {
        team.rounds.push(round);
    }
    const teams = JSON.parse(teamsStr) as Array<Team>;
    const newTeams = teams.filter(t => t.id !== team.id).concat([team]);
    localStorage.setItem("lumberjack.teams", JSON.stringify(newTeams))
}

export const getRows = (): Array<ScoreboardRow> => {
    const rows: Array<ScoreboardRow> = []
    roundToIndexMap.forEach((value, key) => {
        rows.push({label: key, index: value});
    })
    return rows.sort((a, b) => a.index - b.index);
}

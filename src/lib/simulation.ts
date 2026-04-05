import { getPlayerRating } from "@/data/players";

export interface Player {
  name: string;
  rating: number;
}

export interface Team {
  name: string;
  players: Player[];
}

export interface MatchResult {
  team1: string;
  team2: string;
  winner: string;
  team1Score: number;
  team1Wickets: number;
  team2Score: number;
  team2Wickets: number;
  margin: string;
  summary: string;
}

export interface TeamStanding {
  name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: number;
  runsFor: number;
  oversFor: number;
  runsAgainst: number;
  oversAgainst: number;
}

const SUMMARIES_WIN = [
  "Dominant batting display powered the victory",
  "Strong death bowling sealed the win",
  "Captain's knock guided the chase home",
  "Spinners strangled the opposition in the middle overs",
  "Explosive powerplay set up a comfortable win",
  "Clinical run chase under pressure",
  "All-round brilliance carried the team through",
  "Late hitting turned the game around",
  "Pace attack dismantled the batting lineup",
  "Partnership at the top proved decisive",
];

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPlayerPerformance(player: Player): number {
  const forms = [0.7, 1.0, 1.0, 1.0, 1.3];
  const form = pick(forms);
  const randomness = rand(-2, 2);
  return (
    player.rating * rand(0.8, 1.2) * 0.5 +
    player.rating * form * 0.35 +
    randomness * 0.15
  );
}

function getTeamStrength(team: Team): number {
  const total = team.players.reduce((sum, p) => sum + getPlayerPerformance(p), 0);
  return total + rand(-5, 5);
}

function generateScore(strength: number, minScore = 130, maxScore = 220): { runs: number; wickets: number } {
  const normalized = Math.max(0, Math.min(1, (strength - 60) / 60));
  const runs = Math.round(minScore + normalized * (maxScore - minScore) + rand(-15, 15));
  const clampedRuns = Math.max(minScore, Math.min(maxScore, runs));
  const wickets = randInt(3, 10);
  return { runs: clampedRuns, wickets };
}

export function simulateMatch(team1: Team, team2: Team): MatchResult {
  const s1 = getTeamStrength(team1);
  const s2 = getTeamStrength(team2);
  const score1 = generateScore(s1);
  const score2 = generateScore(s2);

  let winner: string;
  let margin: string;
  let summary: string;

  if (score1.runs > score2.runs) {
    winner = team1.name;
    margin = `${score1.runs - score2.runs} runs`;
    summary = pick(SUMMARIES_WIN);
  } else if (score2.runs > score1.runs) {
    winner = team2.name;
    const wicketsRemaining = Math.max(1, 10 - score2.wickets);
    margin = `${wicketsRemaining} wicket${wicketsRemaining > 1 ? "s" : ""}`;
    summary = pick(SUMMARIES_WIN);
  } else {
    winner = Math.random() > 0.5 ? team1.name : team2.name;
    margin = "Super Over";
    summary = "Thrilling Super Over decided the match!";
  }

  return {
    team1: team1.name, team2: team2.name, winner,
    team1Score: score1.runs, team1Wickets: score1.wickets,
    team2Score: score2.runs, team2Wickets: score2.wickets,
    margin, summary,
  };
}

export interface PlayoffResults {
  qualifier1?: MatchResult;
  eliminator?: MatchResult;
  qualifier2?: MatchResult;
  final: MatchResult;
}

export function simulateTournament(teams: Team[]): {
  leagueMatches: MatchResult[];
  standings: TeamStanding[];
  playoffs: PlayoffResults;
  champion: string;
} {
  const standingsMap = new Map<string, TeamStanding>();
  teams.forEach(t => {
    standingsMap.set(t.name, {
      name: t.name, played: 0, won: 0, lost: 0, points: 0,
      nrr: 0, runsFor: 0, oversFor: 0, runsAgainst: 0, oversAgainst: 0,
    });
  });

  const leagueMatches: MatchResult[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const result = simulateMatch(teams[i], teams[j]);
      leagueMatches.push(result);
      const s1 = standingsMap.get(teams[i].name)!;
      const s2 = standingsMap.get(teams[j].name)!;
      s1.played++; s2.played++;
      s1.runsFor += result.team1Score; s1.runsAgainst += result.team2Score;
      s1.oversFor += 20; s1.oversAgainst += 20;
      s2.runsFor += result.team2Score; s2.runsAgainst += result.team1Score;
      s2.oversFor += 20; s2.oversAgainst += 20;
      if (result.winner === teams[i].name) { s1.won++; s1.points += 2; s2.lost++; }
      else { s2.won++; s2.points += 2; s1.lost++; }
    }
  }

  standingsMap.forEach(s => {
    s.nrr = (s.runsFor / s.oversFor) - (s.runsAgainst / s.oversAgainst);
    s.nrr = Math.round(s.nrr * 1000) / 1000;
  });

  const standings = Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });

  const teamMap = new Map(teams.map(t => [t.name, t]));
  let playoffs: PlayoffResults;
  let champion: string;

  if (teams.length === 2) {
    // Direct final
    const final = simulateMatch(teamMap.get(standings[0].name)!, teamMap.get(standings[1].name)!);
    playoffs = { final };
    champion = final.winner;
  } else if (teams.length === 3) {
    // Top 2 play final, but #1 gets direct entry, #2 vs #3 eliminator
    const elim = simulateMatch(teamMap.get(standings[1].name)!, teamMap.get(standings[2].name)!);
    const final = simulateMatch(teamMap.get(standings[0].name)!, teamMap.get(elim.winner)!);
    playoffs = { eliminator: elim, final };
    champion = final.winner;
  } else {
    // 4+ teams: full IPL playoffs with top 4
    const top4 = standings.slice(0, Math.min(4, teams.length));
    const qualifier1 = simulateMatch(teamMap.get(top4[0].name)!, teamMap.get(top4[1].name)!);
    const eliminator = simulateMatch(teamMap.get(top4[2].name)!, teamMap.get(top4[3].name)!);
    const q1Loser = qualifier1.winner === top4[0].name ? top4[1].name : top4[0].name;
    const qualifier2 = simulateMatch(teamMap.get(q1Loser)!, teamMap.get(eliminator.winner)!);
    const final = simulateMatch(teamMap.get(qualifier1.winner)!, teamMap.get(qualifier2.winner)!);
    playoffs = { qualifier1, eliminator, qualifier2, final };
    champion = final.winner;
  }

  return { leagueMatches, standings, playoffs, champion };
}

export function createPlayer(name: string): Player {
  return { name, rating: getPlayerRating(name) };
}

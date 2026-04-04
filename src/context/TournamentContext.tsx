import React, { createContext, useContext, useState, ReactNode } from "react";
import { Team, MatchResult, TeamStanding, PlayoffResults } from "@/lib/simulation";

interface TournamentState {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
  leagueMatches: MatchResult[];
  setLeagueMatches: (m: MatchResult[]) => void;
  standings: TeamStanding[];
  setStandings: (s: TeamStanding[]) => void;
  playoffs: PlayoffResults | null;
  setPlayoffs: (p: PlayoffResults | null) => void;
  champion: string;
  setChampion: (c: string) => void;
  simulated: boolean;
  setSimulated: (s: boolean) => void;
}

const TournamentContext = createContext<TournamentState | null>(null);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagueMatches, setLeagueMatches] = useState<MatchResult[]>([]);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [playoffs, setPlayoffs] = useState<PlayoffResults | null>(null);
  const [champion, setChampion] = useState("");
  const [simulated, setSimulated] = useState(false);

  return (
    <TournamentContext.Provider value={{
      teams, setTeams, leagueMatches, setLeagueMatches,
      standings, setStandings, playoffs, setPlayoffs,
      champion, setChampion, simulated, setSimulated,
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}

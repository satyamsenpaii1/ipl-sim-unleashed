import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { simulateTournament } from "@/lib/simulation";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const SimulatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    teams, setLeagueMatches, setStandings, setPlayoffs, setChampion, setSimulated
  } = useTournament();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (teams.length < 2) navigate("/");
  }, [teams, navigate]);

  const runSimulation = () => {
    setLoading(true);
    setProgress(0);

    // Fake progress for dramatic effect
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 90));
    }, 150);

    setTimeout(() => {
      const result = simulateTournament(teams);
      clearInterval(interval);
      setProgress(100);

      setLeagueMatches(result.leagueMatches);
      setStandings(result.standings);
      setPlayoffs(result.playoffs);
      setChampion(result.champion);
      setSimulated(true);

      setTimeout(() => navigate("/results"), 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        {!loading ? (
          <div className="animate-fade-in-up">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-elevated">
              <Zap className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Ready to Simulate</h1>
            <p className="text-muted-foreground mb-2">{teams.length} teams • Round-Robin + Playoffs</p>
            <p className="text-xs text-muted-foreground mb-8">
              {teams.length * (teams.length - 1) / 2} league matches + {teams.length <= 2 ? 1 : teams.length === 3 ? 2 : 4} playoff matches
            </p>
            <Button
              onClick={runSimulation}
              size="lg"
              className="gradient-accent text-secondary-foreground text-lg px-10 py-6 font-bold rounded-xl shadow-elevated"
            >
              ⚡ Simulate Season
            </Button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-black text-foreground mb-2">Simulating...</h1>
            <p className="text-sm text-muted-foreground mb-6">Matches are being played 🏏</p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulatePage;

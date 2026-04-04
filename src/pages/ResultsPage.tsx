import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import PointsTable from "@/components/PointsTable";
import MatchCard from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft, List, Table, Award } from "lucide-react";

type Tab = "matches" | "table" | "playoffs";

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { leagueMatches, standings, playoffs, champion, simulated } = useTournament();
  const [tab, setTab] = useState<Tab>("table");

  useEffect(() => {
    if (!simulated) navigate("/");
  }, [simulated, navigate]);

  if (!simulated || !playoffs) return null;

  const hasFullPlayoffs = !!playoffs.qualifier1;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "table", label: "Points Table", icon: <Table className="w-4 h-4" /> },
    { key: "matches", label: "Matches", icon: <List className="w-4 h-4" /> },
    { key: "playoffs", label: "Playoffs", icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero text-primary-foreground py-10 px-4 text-center">
        <div className="animate-fade-in-up">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-secondary" />
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60 mb-1">Champion</p>
          <h1 className="text-3xl md:text-4xl font-black">{champion}</h1>
          <p className="text-sm text-primary-foreground/70 mt-2">🏆 IPL Season Winner</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-1 bg-muted p-1 rounded-xl mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === "table" && <PointsTable standings={standings} />}

        {tab === "matches" && (
          <div className="grid gap-3 md:grid-cols-2">
            {leagueMatches.map((m, i) => (
              <MatchCard key={i} match={m} index={i} />
            ))}
          </div>
        )}

        {tab === "playoffs" && (
          <div className="space-y-4">
            {playoffs.qualifier1 && (
              <MatchCard match={playoffs.qualifier1} index={0} isPlayoff playoffLabel="Qualifier 1" />
            )}
            {playoffs.eliminator && (
              <MatchCard match={playoffs.eliminator} index={1} isPlayoff playoffLabel="Eliminator" />
            )}
            {playoffs.qualifier2 && (
              <MatchCard match={playoffs.qualifier2} index={2} isPlayoff playoffLabel="Qualifier 2" />
            )}
            <MatchCard match={playoffs.final} index={3} isPlayoff playoffLabel={hasFullPlayoffs ? "🏆 FINAL" : "🏆 FINAL"} />
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> New Tournament
          </Button>
          <Button onClick={() => navigate("/simulate")} className="gradient-primary text-primary-foreground gap-2">
            ⚡ Re-simulate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

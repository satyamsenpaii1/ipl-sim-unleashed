import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { Team, createPlayer } from "@/lib/simulation";
import PlayerInput from "@/components/PlayerInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Users, Trophy, Trash2 } from "lucide-react";

const TEAM_COLORS = [
  "from-blue-500 to-blue-700",
  "from-orange-500 to-orange-700",
  "from-green-500 to-green-700",
  "from-red-500 to-red-700",
  "from-purple-500 to-purple-700",
  "from-yellow-500 to-yellow-600",
  "from-pink-500 to-pink-700",
  "from-teal-500 to-teal-700",
  "from-indigo-500 to-indigo-700",
  "from-cyan-500 to-cyan-700",
];

const TeamBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { setTeams } = useTournament();
  const [localTeams, setLocalTeams] = useState<{ name: string; players: string[] }[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [playerInputs, setPlayerInputs] = useState<Record<number, string>>({});

  const addTeam = () => {
    if (!newTeamName.trim() || localTeams.length >= 10) return;
    setLocalTeams([...localTeams, { name: newTeamName.trim(), players: [] }]);
    setNewTeamName("");
  };

  const removeTeam = (idx: number) => {
    setLocalTeams(localTeams.filter((_, i) => i !== idx));
  };

  const addPlayer = (teamIdx: number, playerName: string) => {
    if (localTeams[teamIdx].players.length >= 11) return;
    const updated = [...localTeams];
    updated[teamIdx] = {
      ...updated[teamIdx],
      players: [...updated[teamIdx].players, playerName],
    };
    setLocalTeams(updated);
  };

  const removePlayer = (teamIdx: number, playerIdx: number) => {
    const updated = [...localTeams];
    updated[teamIdx] = {
      ...updated[teamIdx],
      players: updated[teamIdx].players.filter((_, i) => i !== playerIdx),
    };
    setLocalTeams(updated);
  };

  const canSimulate = localTeams.length >= 6 && localTeams.every(t => t.players.length === 11);

  const startSimulation = () => {
    const teams: Team[] = localTeams.map(t => ({
      name: t.name,
      players: t.players.map(p => createPlayer(p)),
    }));
    setTeams(teams);
    navigate("/simulate");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Satyam's IPL Simulator
            </h1>
          </div>
          <p className="text-primary-foreground/70 text-sm md:text-base">
            Build your dream teams, simulate a full IPL tournament
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Team */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Create Teams ({localTeams.length}/10)
          </h2>
          <div className="flex gap-2">
            <Input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTeam()}
              placeholder="Enter team name..."
              className="bg-card"
              disabled={localTeams.length >= 10}
            />
            <Button onClick={addTeam} disabled={!newTeamName.trim() || localTeams.length >= 10} className="gradient-primary text-primary-foreground shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          {localTeams.length < 6 && localTeams.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">Need at least 6 teams to simulate</p>
          )}
        </div>

        {/* Team Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {localTeams.map((team, teamIdx) => (
            <div key={teamIdx} className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in-up">
              <div className={`bg-gradient-to-r ${TEAM_COLORS[teamIdx % TEAM_COLORS.length]} px-4 py-3 flex items-center justify-between`}>
                <h3 className="font-bold text-sm text-primary-foreground">{team.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary-foreground/80">{team.players.length}/11</span>
                  <button onClick={() => removeTeam(teamIdx)} className="text-primary-foreground/60 hover:text-primary-foreground">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {team.players.length < 11 && (
                  <div className="mb-3">
                    <PlayerInput
                      value={playerInputs[teamIdx] || ""}
                      onChange={(val) => setPlayerInputs({ ...playerInputs, [teamIdx]: val })}
                      onAdd={(name) => {
                        addPlayer(teamIdx, name);
                        setPlayerInputs({ ...playerInputs, [teamIdx]: "" });
                      }}
                      placeholder={`Add player ${team.players.length + 1}/11`}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  {team.players.map((player, pIdx) => (
                    <div key={pIdx} className="flex items-center justify-between bg-muted rounded-lg px-3 py-1.5 text-sm">
                      <span className="text-foreground">
                        <span className="text-muted-foreground mr-2">{pIdx + 1}.</span>
                        {player}
                      </span>
                      <button onClick={() => removePlayer(teamIdx, pIdx)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                {team.players.length === 11 && (
                  <p className="text-xs text-accent font-medium mt-2">✅ Squad complete!</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Simulate Button */}
        {localTeams.length >= 2 && (
          <div className="mt-8 text-center">
            <Button
              onClick={startSimulation}
              disabled={!canSimulate}
              size="lg"
              className={`text-lg px-8 py-6 font-bold rounded-xl transition-all ${
                canSimulate
                  ? "gradient-accent text-secondary-foreground shadow-elevated animate-pulse-glow"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              {canSimulate ? "Start Tournament →" : `Need ${Math.max(0, 6 - localTeams.length)} more teams with 11 players each`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamBuilder;

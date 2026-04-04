import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { Team, createPlayer } from "@/lib/simulation";
import { isOverseasPlayer } from "@/data/players";
import PlayerInput from "@/components/PlayerInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Users, Trophy, Trash2, Globe, UserPlus } from "lucide-react";
import { toast } from "sonner";

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

interface PlayerEntry {
  name: string;
  isOverseas: boolean;
  isSub: boolean;
}

interface LocalTeam {
  name: string;
  players: PlayerEntry[];
}

const MAX_PLAYING = 11;
const MAX_SUBS = 1;
const MAX_OVERSEAS = 4;

const TeamBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { setTeams } = useTournament();
  const [localTeams, setLocalTeams] = useState<LocalTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [playerInputs, setPlayerInputs] = useState<Record<number, string>>({});
  const [addingMode, setAddingMode] = useState<Record<number, "playing" | "sub">>({});

  // Collect all selected players across all teams
  const allSelectedPlayers = useMemo(() => {
    const set = new Set<string>();
    localTeams.forEach(t => t.players.forEach(p => set.add(p.name.toLowerCase())));
    return set;
  }, [localTeams]);

  const addTeam = () => {
    if (!newTeamName.trim() || localTeams.length >= 10) return;
    setLocalTeams([...localTeams, { name: newTeamName.trim(), players: [] }]);
    setNewTeamName("");
  };

  const removeTeam = (idx: number) => {
    setLocalTeams(localTeams.filter((_, i) => i !== idx));
  };

  const getPlayingCount = (team: LocalTeam) => team.players.filter(p => !p.isSub).length;
  const getSubCount = (team: LocalTeam) => team.players.filter(p => p.isSub).length;
  const getOverseasCount = (team: LocalTeam) => team.players.filter(p => p.isOverseas).length;

  const addPlayer = (teamIdx: number, rawName: string) => {
    const team = localTeams[teamIdx];
    const isSub = addingMode[teamIdx] === "sub";
    const playingCount = getPlayingCount(team);
    const subCount = getSubCount(team);

    if (!isSub && playingCount >= MAX_PLAYING) return;
    if (isSub && subCount >= MAX_SUBS) return;

    const finalName = rawName.trim();
    if (!finalName) return;

    // Check duplicate across all teams
    if (allSelectedPlayers.has(finalName.toLowerCase())) {
      toast.error(`${finalName} is already selected in a team!`);
      return;
    }

    const overseas = isOverseasPlayer(finalName);

    if (overseas && getOverseasCount(team) >= MAX_OVERSEAS) {
      toast.error(`Maximum ${MAX_OVERSEAS} overseas players allowed per team!`);
      return;
    }

    const updated = [...localTeams];
    updated[teamIdx] = {
      ...updated[teamIdx],
      players: [...updated[teamIdx].players, { name: finalName, isOverseas: overseas, isSub }],
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

  const canSimulate = localTeams.length >= 2 && localTeams.every(t => getPlayingCount(t) === 11);

  const startSimulation = () => {
    const teams: Team[] = localTeams.map(t => ({
      name: t.name,
      players: t.players.filter(p => !p.isSub).map(p => createPlayer(p.name)),
    }));
    setTeams(teams);
    navigate("/simulate");
  };

  return (
    <div className="min-h-screen bg-background">
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
          {localTeams.length < 2 && localTeams.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">Need at least 2 teams to simulate</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {localTeams.map((team, teamIdx) => {
            const playingCount = getPlayingCount(team);
            const subCount = getSubCount(team);
            const overseasCount = getOverseasCount(team);
            const mode = addingMode[teamIdx] || "playing";
            const canAddPlaying = playingCount < MAX_PLAYING;
            const canAddSub = subCount < MAX_SUBS;

            return (
              <div key={teamIdx} className="bg-card rounded-xl border border-border shadow-card overflow-hidden animate-fade-in-up">
                <div className={`bg-gradient-to-r ${TEAM_COLORS[teamIdx % TEAM_COLORS.length]} px-4 py-3 flex items-center justify-between`}>
                  <h3 className="font-bold text-sm text-primary-foreground">{team.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-0">
                      <Globe className="w-3 h-3 mr-1" />{overseasCount}/{MAX_OVERSEAS}
                    </Badge>
                    <button onClick={() => removeTeam(teamIdx)} className="text-primary-foreground/60 hover:text-primary-foreground">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {(canAddPlaying || canAddSub) && (
                    <div className="flex gap-1 mb-3">
                      <button
                        onClick={() => setAddingMode({ ...addingMode, [teamIdx]: "playing" })}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                          mode === "playing"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        disabled={!canAddPlaying}
                      >
                        Playing XI ({playingCount}/11)
                      </button>
                      <button
                        onClick={() => setAddingMode({ ...addingMode, [teamIdx]: "sub" })}
                        className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                          mode === "sub"
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        disabled={!canAddSub}
                      >
                        <UserPlus className="w-3 h-3 inline mr-1" />Sub ({subCount}/1)
                      </button>
                    </div>
                  )}

                  {((mode === "playing" && canAddPlaying) || (mode === "sub" && canAddSub)) && (
                    <div className="mb-3">
                      <PlayerInput
                        value={playerInputs[teamIdx] || ""}
                        onChange={(val) => setPlayerInputs({ ...playerInputs, [teamIdx]: val })}
                        onAdd={(name) => {
                          addPlayer(teamIdx, name);
                          setPlayerInputs({ ...playerInputs, [teamIdx]: "" });
                        }}
                        placeholder={
                          mode === "playing"
                            ? `Add player ${playingCount + 1}/11`
                            : `Add substitute`
                        }
                        excludePlayers={allSelectedPlayers}
                      />
                    </div>
                  )}

                  {team.players.filter(p => !p.isSub).length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Playing XI</p>
                      <div className="space-y-1">
                        {team.players.filter(p => !p.isSub).map((player, pIdx) => {
                          const actualIdx = team.players.indexOf(player);
                          return (
                            <div key={actualIdx} className="flex items-center justify-between bg-muted rounded-lg px-3 py-1.5 text-sm">
                              <span className="text-foreground flex items-center gap-1.5">
                                <span className="text-muted-foreground text-xs">{pIdx + 1}.</span>
                                {player.name}
                                {player.isOverseas && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-blue-400 text-blue-400">OS</Badge>
                                )}
                              </span>
                              <button onClick={() => removePlayer(teamIdx, actualIdx)} className="text-muted-foreground hover:text-destructive">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {team.players.filter(p => p.isSub).length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Substitute</p>
                      <div className="space-y-1">
                        {team.players.filter(p => p.isSub).map((player) => {
                          const actualIdx = team.players.indexOf(player);
                          return (
                            <div key={actualIdx} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-1.5 text-sm border border-dashed border-border">
                              <span className="text-foreground/70 flex items-center gap-1.5">
                                <UserPlus className="w-3 h-3 text-muted-foreground" />
                                {player.name}
                                {player.isOverseas && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-blue-400 text-blue-400">OS</Badge>
                                )}
                              </span>
                              <button onClick={() => removePlayer(teamIdx, actualIdx)} className="text-muted-foreground hover:text-destructive">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {playingCount === 11 && (
                    <p className="text-xs text-accent font-medium mt-2">✅ Squad complete!</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {localTeams.length >= 1 && (
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
              {canSimulate ? "Start Tournament →" : `Need ${Math.max(0, 2 - localTeams.length)} more teams with 11 players each`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamBuilder;

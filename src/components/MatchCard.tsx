import React from "react";
import { MatchResult } from "@/lib/simulation";

interface MatchCardProps {
  match: MatchResult;
  index: number;
  isPlayoff?: boolean;
  playoffLabel?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, index, isPlayoff, playoffLabel }) => {
  return (
    <div
      className="bg-card rounded-xl border border-border p-4 shadow-card animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {playoffLabel && (
        <div className="text-xs font-bold gradient-accent text-secondary-foreground inline-block px-2 py-0.5 rounded-full mb-2">
          {playoffLabel}
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className={`font-semibold text-sm ${match.winner === match.team1 ? "text-primary" : "text-foreground"}`}>
            {match.team1}
          </p>
          <p className="text-xs text-muted-foreground">
            {match.team1Score}/{match.team1Wickets}
          </p>
        </div>
        <div className="px-3 text-xs font-bold text-muted-foreground">VS</div>
        <div className="flex-1 text-right">
          <p className={`font-semibold text-sm ${match.winner === match.team2 ? "text-primary" : "text-foreground"}`}>
            {match.team2}
          </p>
          <p className="text-xs text-muted-foreground">
            {match.team2Score}/{match.team2Wickets}
          </p>
        </div>
      </div>
      <div className="border-t border-border pt-2 mt-2">
        <p className="text-xs font-medium text-accent">
          🏏 {match.winner} won by {match.margin}
        </p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          "{match.summary}"
        </p>
      </div>
    </div>
  );
};

export default MatchCard;

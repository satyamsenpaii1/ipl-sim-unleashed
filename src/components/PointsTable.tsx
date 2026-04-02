import React from "react";
import { TeamStanding } from "@/lib/simulation";

interface PointsTableProps {
  standings: TeamStanding[];
}

const PointsTable: React.FC<PointsTableProps> = ({ standings }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="gradient-hero text-primary-foreground">
            <th className="text-left px-4 py-3 font-semibold">#</th>
            <th className="text-left px-4 py-3 font-semibold">Team</th>
            <th className="text-center px-3 py-3 font-semibold">P</th>
            <th className="text-center px-3 py-3 font-semibold">W</th>
            <th className="text-center px-3 py-3 font-semibold">L</th>
            <th className="text-center px-3 py-3 font-semibold">NRR</th>
            <th className="text-center px-3 py-3 font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr
              key={s.name}
              className={`border-t border-border transition-colors ${
                i < 4 ? "bg-primary/5" : "bg-card"
              } hover:bg-muted`}
            >
              <td className="px-4 py-3 font-medium text-muted-foreground">{i + 1}</td>
              <td className="px-4 py-3 font-semibold text-foreground">
                {s.name}
                {i < 4 && (
                  <span className="ml-2 text-xs text-accent font-medium">Q</span>
                )}
              </td>
              <td className="text-center px-3 py-3 text-muted-foreground">{s.played}</td>
              <td className="text-center px-3 py-3 font-medium text-accent">{s.won}</td>
              <td className="text-center px-3 py-3 text-destructive">{s.lost}</td>
              <td className="text-center px-3 py-3 text-muted-foreground">
                {s.nrr > 0 ? "+" : ""}{s.nrr.toFixed(3)}
              </td>
              <td className="text-center px-3 py-3 font-bold text-primary">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PointsTable;

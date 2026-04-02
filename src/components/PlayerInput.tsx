import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { getSuggestions, fuzzyMatchPlayer } from "@/lib/fuzzyMatch";

interface PlayerInputProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (name: string) => void;
  placeholder?: string;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ value, onChange, onAdd, placeholder }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [corrected, setCorrected] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (val: string) => {
    onChange(val);
    const s = getSuggestions(val);
    setSuggestions(s);
    setShowSuggestions(s.length > 0);
    setCorrected(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      const match = fuzzyMatchPlayer(value);
      if (match && match.toLowerCase() !== value.toLowerCase()) {
        setCorrected(match);
        setShowSuggestions(false);
      } else {
        onAdd(match || value.trim());
        onChange("");
        setCorrected(null);
        setShowSuggestions(false);
      }
    }
  };

  const selectSuggestion = (name: string) => {
    onAdd(name);
    onChange("");
    setShowSuggestions(false);
    setCorrected(null);
  };

  const acceptCorrection = () => {
    if (corrected) {
      onAdd(corrected);
      onChange("");
      setCorrected(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type player name and press Enter"}
        className="bg-background border-border"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-elevated overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground"
              onClick={() => selectSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {corrected && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            Did you mean <span className="font-semibold text-primary">{corrected}</span>?
          </span>
          <button
            onClick={acceptCorrection}
            className="text-xs gradient-primary text-primary-foreground px-2 py-1 rounded-md"
          >
            Yes
          </button>
          <button
            onClick={() => {
              onAdd(value.trim());
              onChange("");
              setCorrected(null);
            }}
            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md"
          >
            No, keep original
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerInput;

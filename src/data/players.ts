// Elite players with rating 9
export const ELITE_PLAYERS: string[] = [
  "Virat Kohli", "Rohit Sharma", "MS Dhoni", "Jasprit Bumrah",
  "Suryakumar Yadav", "KL Rahul", "Rashid Khan", "Pat Cummins",
  "Jos Buttler", "Faf du Plessis", "AB de Villiers", "David Warner",
  "Ravindra Jadeja", "Hardik Pandya", "Rishabh Pant",
  "Yuzvendra Chahal", "Kagiso Rabada", "Trent Boult",
  "Andre Russell", "Sunil Narine", "Glenn Maxwell",
  "Shubman Gill", "Sanju Samson", "Mohammed Shami",
  "Mitchell Starc", "Travis Head", "Heinrich Klaasen",
];

// Strong players with rating 8
export const STRONG_PLAYERS: string[] = [
  "Shreyas Iyer", "Ishan Kishan", "Ruturaj Gaikwad", "Devdutt Padikkal",
  "Prithvi Shaw", "Deepak Chahar", "Bhuvneshwar Kumar", "Shardul Thakur",
  "Axar Patel", "Washington Sundar", "Kuldeep Yadav", "Arshdeep Singh",
  "Quinton de Kock", "Marcus Stoinis", "Liam Livingstone",
  "Sam Curran", "Ben Stokes", "Moeen Ali", "Shimron Hetmyer",
  "Nicholas Pooran", "Rahul Tripathi", "Venkatesh Iyer",
  "Yashasvi Jaiswal", "Rinku Singh", "Tilak Varma",
  "Rajat Patidar", "Cameron Green", "Phil Salt",
  "Mohammed Siraj", "Umran Malik", "Mohit Sharma",
  "Tushar Deshpande", "Mukesh Kumar", "Matheesha Pathirana",
  "Rachin Ravindra", "Will Jacks", "Jake Fraser-McGurk",
];

// All known players for autocomplete
export const ALL_KNOWN_PLAYERS: string[] = [...ELITE_PLAYERS, ...STRONG_PLAYERS];

export function getPlayerRating(name: string): number {
  const normalized = name.toLowerCase().trim();
  if (ELITE_PLAYERS.some(p => p.toLowerCase() === normalized)) return 9;
  if (STRONG_PLAYERS.some(p => p.toLowerCase() === normalized)) return 8;
  return 7;
}

// Shared data for the health monitoring section. All numbers are
// illustrative samples, never live readings.

// One heartbeat of a monitor-style trace, 100 units wide, baseline at 50.
const BEAT = (x: number) =>
  `L${x + 16} 50 Q${x + 20} 43 ${x + 24} 50 L${x + 33} 50 L${x + 36} 55 L${x + 40} 14 L${x + 44} 68 L${x + 47} 50 L${x + 57} 50 Q${x + 66} 36 ${x + 75} 50 L${x + 100} 50`;
export const TRACE = `M0 50 ${Array.from({ length: 8 }, (_, i) => BEAT(i * 100)).join(" ")}`;

// Sample week of resting heart rate (illustrative).
export const RESTING = [
  { day: "Mon", bpm: 63 },
  { day: "Tue", bpm: 61 },
  { day: "Wed", bpm: 62 },
  { day: "Thu", bpm: 59 },
  { day: "Fri", bpm: 60 },
  { day: "Sat", bpm: 57 },
  { day: "Sun", bpm: 58 },
];

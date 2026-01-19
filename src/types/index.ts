export type Phase = 'FOCUS' | 'DISCOVERY';

export interface Weapon {
  id: string;
  name: string;
  attack: number;
  durability: number;
  maxDurability: number;
}

export interface GameState {
  phase: Phase;
  timer: number; // in seconds
  isRunning: boolean;
  weapon: Weapon | null;
  backgroundTimestamp: number | null; // Timestamp when app went to background

  // Actions
  setPhase: (phase: Phase) => void;
  startTimer: () => void;
  stopTimer: () => void;
  tickTimer: () => void;
  setWeapon: (weapon: Weapon) => void;
  decreaseDurability: (amount?: number) => void;
  recoverDurability: () => void;
  setBackgroundTimestamp: (timestamp: number | null) => void;
  resetTimer: (initialTime?: number) => void;
}

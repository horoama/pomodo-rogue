import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Phase, Weapon } from '../types';

const FOCUS_TIME = 25 * 60; // 25 minutes
// const FOCUS_TIME = 10; // Debug: 10 seconds

const INITIAL_WEAPON: Weapon = {
  id: 'rusty_katana',
  name: '錆びた刀',
  attack: 5,
  durability: 5,
  maxDurability: 5,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'FOCUS',
      timer: FOCUS_TIME,
      isRunning: false,
      weapon: INITIAL_WEAPON,
      backgroundTimestamp: null,

      setPhase: (phase: Phase) => set({ phase }),

      startTimer: () => set({ isRunning: true }),

      stopTimer: () => set({ isRunning: false }),

      tickTimer: () => {
        const { timer, phase, weapon } = get();
        if (timer > 0) {
          set({ timer: timer - 1 });
        } else {
            // Timer finished
            set({ isRunning: false });
            if (phase === 'FOCUS') {
                 // Success! Recover durability
                 get().recoverDurability();
                 set({ phase: 'DISCOVERY', timer: 5 * 60 }); // 5 min break/discovery
            } else {
                // Discovery finished
                set({ phase: 'FOCUS', timer: FOCUS_TIME });
            }
        }
      },

      setWeapon: (weapon: Weapon) => set({ weapon }),

      decreaseDurability: (amount = 1) => {
        const { weapon } = get();
        if (weapon && weapon.durability > 0) {
          const newDurability = Math.max(0, weapon.durability - amount);
          set({
            weapon: {
              ...weapon,
              durability: newDurability,
            },
          });
        }
      },

      recoverDurability: () => {
          const { weapon } = get();
          if (weapon) {
              set({
                  weapon: {
                      ...weapon,
                      durability: Math.min(weapon.maxDurability, weapon.durability + 1)
                  }
              });
          }
      },

      setBackgroundTimestamp: (timestamp: number | null) => set({ backgroundTimestamp: timestamp }),

      resetTimer: (initialTime = FOCUS_TIME) => set({ timer: initialTime, isRunning: false }),
    }),
    {
      name: 'pomo-drogue-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

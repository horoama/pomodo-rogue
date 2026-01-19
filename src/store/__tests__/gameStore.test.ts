import { act } from '@testing-library/react-native';
import { useGameStore } from '../gameStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('GameStore Logic', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useGameStore.setState({
        phase: 'FOCUS',
        timer: 25 * 60,
        isRunning: false,
        weapon: {
          id: 'rusty_katana',
          name: '錆びた刀',
          attack: 5,
          durability: 5,
          maxDurability: 5,
        },
        backgroundTimestamp: null,
      });
    });
    jest.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const state = useGameStore.getState();
    expect(state.phase).toBe('FOCUS');
    expect(state.timer).toBe(25 * 60);
    expect(state.isRunning).toBe(false);
    expect(state.weapon?.name).toBe('錆びた刀');
  });

  it('should start and stop timer', () => {
    act(() => {
      useGameStore.getState().startTimer();
    });
    expect(useGameStore.getState().isRunning).toBe(true);

    act(() => {
      useGameStore.getState().stopTimer();
    });
    expect(useGameStore.getState().isRunning).toBe(false);
  });

  it('should tick timer and switch phase on completion', () => {
    // Set timer to 0 seconds (ready to complete)
    act(() => {
        useGameStore.setState({ timer: 0, isRunning: true });
    });

    // Tick (0 -> Completion)
    act(() => {
      useGameStore.getState().tickTimer();
    });

    const state = useGameStore.getState();
    expect(state.isRunning).toBe(false);
    expect(state.phase).toBe('DISCOVERY'); // Switched to Discovery
    expect(state.timer).toBe(5 * 60); // 5 min break
  });

  it('should switch from DISCOVERY to FOCUS on completion', () => {
      act(() => {
          useGameStore.setState({ phase: 'DISCOVERY', timer: 0, isRunning: true });
      });

      act(() => {
          useGameStore.getState().tickTimer();
      });

      const state = useGameStore.getState();
      expect(state.phase).toBe('FOCUS');
      expect(state.timer).toBe(25 * 60);
      expect(state.isRunning).toBe(false);
  });

  it('should recover durability by +1 on successful focus completion', () => {
      // Set broken weapon and timer to 0
      act(() => {
          useGameStore.setState({
              weapon: { ...useGameStore.getState().weapon!, durability: 1 },
              timer: 0,
              isRunning: true,
              phase: 'FOCUS'
          });
      });

      // Complete timer
      act(() => {
          useGameStore.getState().tickTimer();
      });

      const state = useGameStore.getState();
      // Expect 1 + 1 = 2
      expect(state.weapon?.durability).toBe(2);
  });

  it('should not recover durability above max', () => {
      // Set almost full weapon
      act(() => {
          useGameStore.setState({
              weapon: { ...useGameStore.getState().weapon!, durability: 5 },
              timer: 0,
              isRunning: true,
              phase: 'FOCUS'
          });
      });

      // Complete timer
      act(() => {
          useGameStore.getState().tickTimer();
      });

      const state = useGameStore.getState();
      // Expect 5 (max)
      expect(state.weapon?.durability).toBe(5);
  });

  it('should decrease durability', () => {
    act(() => {
      useGameStore.getState().decreaseDurability(1);
    });
    expect(useGameStore.getState().weapon?.durability).toBe(4);
  });

  it('should not decrease durability below 0', () => {
      act(() => {
        useGameStore.setState({
            weapon: { ...useGameStore.getState().weapon!, durability: 0 }
        });
        useGameStore.getState().decreaseDurability(1);
      });
      expect(useGameStore.getState().weapon?.durability).toBe(0);
  });

  it('should set background timestamp', () => {
      const now = 1234567890;
      act(() => {
          useGameStore.getState().setBackgroundTimestamp(now);
      });
      expect(useGameStore.getState().backgroundTimestamp).toBe(now);
  });
});

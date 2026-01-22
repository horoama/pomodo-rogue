import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, AppState, AppStateStatus, Platform, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { setLanguage } from '../i18n';

export const FocusScreen = () => {
  const { t, i18n } = useTranslation();
  const {
    timer,
    phase,
    isRunning,
    weapon,
    startTimer,
    stopTimer,
    tickTimer,
    decreaseDurability,
    backgroundTimestamp,
    setBackgroundTimestamp
  } = useGameStore();

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tickTimer]);

  // AppState Monitoring Logic (Real Device)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [backgroundTimestamp, isRunning, phase]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (phase !== 'FOCUS' || !isRunning) return;

    if (nextAppState.match(/inactive|background/)) {
        // App went to background
        setBackgroundTimestamp(Date.now());
    } else if (nextAppState === 'active') {
        // App came back to foreground
        checkBackgroundDuration();
    }
  };

  const checkBackgroundDuration = () => {
      const now = Date.now();
      const bgTime = useGameStore.getState().backgroundTimestamp;

      if (bgTime) {
          const diff = now - bgTime;
          if (diff > 3000) { // 3 seconds
              console.log(`Backgrounded for ${diff}ms. Penalty applied.`);
              decreaseDurability(1);
              alert(t('focus.durability_lost'));
          } else {
              console.log(`Backgrounded for ${diff}ms. Safe.`);
          }
          setBackgroundTimestamp(null);
      }
  };

  // Simulation handlers for Web/Debugging
  const simulateBackground = () => {
      if (phase !== 'FOCUS' || !isRunning) return;
      console.log('Simulating Background Entry');
      setBackgroundTimestamp(Date.now());
  };

  const simulateActive = () => {
      if (phase !== 'FOCUS' || !isRunning) {
           setBackgroundTimestamp(null);
           return;
      }
      console.log('Simulating Foreground Entry');
      checkBackgroundDuration();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLanguage = () => {
      const newLang = i18n.language === 'ja' ? 'en' : 'ja';
      setLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phaseTitle}>{phase === 'FOCUS' ? t('focus.title') : t('discovery.title')}</Text>

      <Text style={styles.timer}>{formatTime(timer)}</Text>

      {/* Visual representation of the adventurer (Placeholder) */}
      <View style={styles.adventurerContainer}>
          <Image
            source={require('../../assets/adventurer.png')}
            style={styles.adventurerImage}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/fire.png')}
            style={styles.fireImage}
            resizeMode="contain"
          />
      </View>

      <View style={styles.weaponStatus}>
          <Text>{t('weapon.durability')}: {weapon?.durability} / {weapon?.maxDurability}</Text>
          <Text>{t('weapon.attack')}: {weapon?.attack}</Text>
          {weapon?.durability === 0 && <Text style={{color: 'red'}}>{t('focus.weapon_broken')}</Text>}
      </View>

      <View style={styles.controls}>
          {!isRunning ? (
              <Button title={t('focus.start')} onPress={startTimer} />
          ) : (
              <Button title={t('focus.stop')} onPress={stopTimer} color="red" />
          )}
      </View>

      <View style={styles.debugControls}>
          <Text style={styles.debugTitle}>Debug / Simulation</Text>
          <Button title={t('debug.simulate_background')} onPress={simulateBackground} disabled={!isRunning || phase !== 'FOCUS'} />
          <View style={{height: 10}} />
          <Button title={t('debug.simulate_active')} onPress={simulateActive} disabled={!isRunning || phase !== 'FOCUS'} />
      </View>

      <View style={styles.settings}>
          <Button title={`Language: ${i18n.language.toUpperCase()}`} onPress={toggleLanguage} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    padding: 20,
  },
  phaseTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  timer: {
    fontSize: 64,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 40,
  },
  adventurerContainer: {
      flexDirection: 'row',
      marginBottom: 30,
      alignItems: 'flex-end',
  },
  adventurerImage: {
      width: 64,
      height: 64,
      marginRight: 10,
  },
  fireImage: {
      width: 48,
      height: 48,
  },
  weaponStatus: {
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      width: '100%',
      alignItems: 'center',
  },
  controls: {
      marginBottom: 30,
      width: '100%',
  },
  debugControls: {
      marginTop: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 5,
      width: '100%',
  },
  debugTitle: {
      color: '#aaa',
      marginBottom: 5,
      textAlign: 'center',
      fontSize: 12,
  },
  settings: {
      marginTop: 30,
  }
});

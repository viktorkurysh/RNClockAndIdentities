/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Animated, {
  Value,
  useCode,
  Clock,
  add,
  interpolate,
  Extrapolate,
  startClock,
  stopClock,
  set,
  not,
  cond,
  eq,
  proc
} from 'react-native-reanimated';
import {useClock, useValues} from 'react-native-redash/lib/module/v1';

const runAnimation = proc(
  (startAnimation, clock, from, to, startTime, opacity) =>
    cond(eq(startAnimation, 1), [
      startClock(clock),
      set(from, opacity),
      set(to, not(to)),
      set(startTime, clock),
      set(startAnimation, 0),
    ]),
);

function App() {
  const [show, setShow] = useState(true);

  const startAnimation = new Value(0);
  const clock = useClock([]);
  const [startTime, from, to] = useValues(0, 0, 1);
  const duration = 1000;
  const endTime = add(startTime, duration);

  function handleButtonPressed() {
    startAnimation.setValue(1);
    setShow((prev) => !prev);
  }

  const opacity = interpolate(clock, {
    inputRange: [startTime, endTime],
    outputRange: [from, to],
    extrapolate: Extrapolate.CLAMP,
  });

  useCode(
    () => runAnimation(startAnimation, clock, from, to, startTime, opacity),
    [clock, from, to, startAnimation, startTime],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Clock & Identities</Text>
        </View>
        <Animated.View style={{opacity}}>
          <View style={styles.card} />
        </Animated.View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPressed}
          activeOpacity={1}>
          <Text style={styles.title}>{show ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c5aff',
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 70,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3c5aff',
  },
  button: {
    width: '100%',
    height: 70,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: '#3c5aff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
  },
  card: {
    height: 200,
    width: 300,
    backgroundColor: '#eacd01',
    borderRadius: 12,
  },
});

export default App;

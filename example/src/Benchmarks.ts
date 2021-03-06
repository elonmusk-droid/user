import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

declare global {
  var performance: {
    now: () => number;
  };
}

const storage = new MMKV({ id: 'benchmark' });

export const benchmarkAgainstAsyncStorage = async () => {
  console.log('Starting benchmark...');

  await AsyncStorage.setItem('test', 'Some test string.');
  console.log('wrote test value to AsyncStorage');
  storage.set('test', 'Some test string.');
  console.log('wrote test value to MMKV');

  const iters = 1000;
  let value: string | null | undefined = null;

  const benchmarkAsyncStorage = async (): Promise<void> => {
    const start = global.performance.now();
    for (let i = 0; i < iters; i++) {
      value = await AsyncStorage.getItem('test');
    }
    const end = global.performance.now();
    console.log(`AsyncStorage: ${end - start}ms for ${iters}x get()`);
  };
  const benchmarkMMKV = async (): Promise<void> => {
    const start = global.performance.now();
    for (let i = 0; i < iters; i++) {
      value = storage.getString('test');
    }
    const end = global.performance.now();
    console.log(`MMKV: ${end - start}ms for ${iters}x get()`);
  };

  await benchmarkAsyncStorage();
  await benchmarkMMKV();
  console.log(`Benchmarks finished. final value: ${value}`);
};

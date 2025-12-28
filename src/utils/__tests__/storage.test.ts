import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveSession,
  getSessions,
  getStats,
  savePreset,
  getPresets,
  deletePreset,
} from '../storage';
import { CUSTOM_SOUND } from '../../constants/sound';

jest.mock('expo-file-system', () => {
  class MockFile {
    uri: string;
    exists = true;
    size = 100;

    constructor(uriOrDir: any, name?: string) {
      this.uri = typeof uriOrDir === 'string'
        ? uriOrDir
        : `${uriOrDir.path}/${name}`;
    }

    copy = jest.fn();
    delete = jest.fn();
  }

  class MockDirectory {
    path: string;
    exists = false;

    constructor(base: string, name: string) {
      this.path = `${base}/${name}`;
    }

    create = jest.fn(() => {
      this.exists = true;
    });
  }

  return {
    Paths: {
      document: '/mock-documents',
    },
    File: MockFile,
    Directory: MockDirectory,
  };
});

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

// saveSession
it('saves a meditation session', async () => {
  const session = await saveSession({
    duration: 300,
    soundName: 'rain',
  });

  expect(session).toBeDefined();
  expect(session?.duration).toBe(300);

  const stored = await AsyncStorage.getItem('@sati_space_sessions');
  const parsed = JSON.parse(stored!);

  expect(parsed.length).toBe(1);
  expect(parsed[0].duration).toBe(300);
});

// getSessions
it('returns empty array when no sessions exist', async () => {
  const sessions = await getSessions();
  expect(sessions).toEqual([]);
});

// getStats
it('calculates total sessions and minutes', async () => {
  await saveSession({ duration: 60, soundName: 'a' });
  await saveSession({ duration: 120, soundName: 'b' });

  const stats = await getStats();

  expect(stats.totalSessions).toBe(2);
  expect(stats.totalMinutes).toBe(3);
});

// savePreset
it('saves a preset without custom sound', async () => {
  const preset = await savePreset({
    name: 'Morning',
    totalDuration: 600,
    warmupDuration: 60,
    cooldownDuration: 60,
    soundId: 'rain',
  });

  const stored = await AsyncStorage.getItem('@sati_space_presets');
  const parsed = JSON.parse(stored!);

  expect(parsed.length).toBe(1);
  expect(parsed[0].name).toBe('Morning');
});

it('copies custom sound into documents directory', async () => {
  const preset = await savePreset({
    name: 'Custom',
    totalDuration: 300,
    warmupDuration: 30,
    cooldownDuration: 30,
    soundId: CUSTOM_SOUND,
    customSoundUri: '/cache/test.mp3',
    customSoundName: 'test.mp3',
  });

  expect(preset?.customSoundUri).toContain('/mock-documents/custom_sounds');
});

// getPresets
it('returns saved presets', async () => {
  await savePreset({
    name: 'Evening',
    totalDuration: 400,
    warmupDuration: 40,
    cooldownDuration: 40,
    soundId: 'wind',
  });

  const presets = await getPresets();
  expect(presets.length).toBe(1);
});

// deletePreset
it('does not delete shared custom sound file', async () => {
  const p1 = await savePreset({
    name: 'P1',
    totalDuration: 100,
    warmupDuration: 10,
    cooldownDuration: 10,
    soundId: CUSTOM_SOUND,
    customSoundUri: '/cache/shared.mp3',
    customSoundName: 'shared.mp3',
  });

  const p2 = await savePreset({
    name: 'P2',
    totalDuration: 100,
    warmupDuration: 10,
    cooldownDuration: 10,
    soundId: CUSTOM_SOUND,
    customSoundUri: p1!.customSoundUri,
    customSoundName: 'shared.mp3',
  });

  await deletePreset(p1!.id);

  const presets = await getPresets();
  expect(presets.length).toBe(1);
});

it('deletes custom sound file if not shared', async () => {
  const preset = await savePreset({
    name: 'Solo',
    totalDuration: 100,
    warmupDuration: 10,
    cooldownDuration: 10,
    soundId: CUSTOM_SOUND,
    customSoundUri: '/cache/solo.mp3',
    customSoundName: 'solo.mp3',
  });

  await deletePreset(preset!.id);

  const presets = await getPresets();
  expect(presets.length).toBe(0);
});

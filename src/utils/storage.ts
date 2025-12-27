import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MeditationSession {
  id: string;
  timestamp: number;
  duration: number; // in seconds
  soundName: string;
}

const STORAGE_KEY = "@sati_space_sessions";

export const saveSession = async (
  session: Omit<MeditationSession, "id" | "timestamp">
) => {
  try {
    const newSession: MeditationSession = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...session,
    };

    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const sessions: MeditationSession[] = existingData
      ? JSON.parse(existingData)
      : [];

    sessions.unshift(newSession); // Add to beginning

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession;
  } catch (err) {
    console.error("Failed to save session", err);
  }
};

export const getSessions = async (): Promise<MeditationSession[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load sessions", err);
    return [];
  }
};

export interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
}

export const getStats = async (): Promise<MeditationStats> => {
  const sessions = await getSessions();
  const totalSessions = sessions.length;
  const totalMinutes =
    sessions.reduce((acc, curr) => acc + curr.duration, 0) / 60;

  return {
    totalSessions,
    totalMinutes,
  };
};

export interface Preset {
  id: string;
  name: string;
  totalDuration: number;
  warmupDuration: number;
  cooldownDuration: number;
  soundId: string;
  customSoundUri?: string;
  customSoundName?: string;
}

const PRESET_KEY = "@sati_space_presets";

export const savePreset = async (preset: Omit<Preset, "id">) => {
  try {
    const newPreset: Preset = {
      id: Date.now().toString(),
      ...preset,
    };

    const existing = await AsyncStorage.getItem(PRESET_KEY);
    const presets: Preset[] = existing ? JSON.parse(existing) : [];
    presets.push(newPreset);
    await AsyncStorage.setItem(PRESET_KEY, JSON.stringify(presets));
    return newPreset;
  } catch (err) {
    console.error("Failed to save preset", err);
  }
};

export const getPresets = async (): Promise<Preset[]> => {
  try {
    const data = await AsyncStorage.getItem(PRESET_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

export const deletePreset = async (id: string) => {
  try {
    const existing = await AsyncStorage.getItem(PRESET_KEY);
    if (!existing) return;
    const presets: Preset[] = JSON.parse(existing);
    const filtered = presets.filter((p) => p.id !== id);
    await AsyncStorage.setItem(PRESET_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete preset", err);
  }
};

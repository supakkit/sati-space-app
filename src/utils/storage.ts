import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { CUSTOM_SOUND } from "../constants/sound";

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

export const CUSTOM_SOUND_DIRECTORY = "custom_sounds";

const getSoundsFolder = () => {
  const soundsDir = new FileSystem.Directory(
    FileSystem.Paths.document,
    CUSTOM_SOUND_DIRECTORY
  );

  // Create it if it doesn't exist
  if (!soundsDir.exists) {
    soundsDir.create();
  }

  return soundsDir;
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

    if (
      newPreset.soundId === CUSTOM_SOUND &&
      newPreset.customSoundName &&
      newPreset.customSoundUri
    ) {
      const soundsDir = getSoundsFolder();

      // Reference the source (the picked file in cache)
      const sourceFile = new FileSystem.File(newPreset.customSoundUri);

      // Create a permanent path in the Documents folder
      const permanentFile = new FileSystem.File(
        soundsDir,
        newPreset.customSoundName
      );

      if (permanentFile.exists) {
        const existingSize = permanentFile.size;

        if (existingSize !== sourceFile.size) {
          permanentFile.delete();
          sourceFile.copy(permanentFile);
        }
      } else {
        sourceFile.copy(permanentFile);
      }

      newPreset.customSoundUri = permanentFile.uri;
    }

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

    const presetToDelete = presets.find((p) => p.id === id);

    if (
      presetToDelete?.soundId === CUSTOM_SOUND &&
      presetToDelete.customSoundUri
    ) {
      // Check if any OTHER preset uses this same file
      const isFileShared = presets.some(
        (p) => p.id !== id && p.customSoundUri === presetToDelete.customSoundUri
      );

      if (!isFileShared) {
        try {
          const file = new FileSystem.File(presetToDelete.customSoundUri);
          if (file.exists) {
            file.delete();
          }
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      }
    }

    const filtered = presets.filter((p) => p.id !== id);
    await AsyncStorage.setItem(PRESET_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete preset", err);
  }
};

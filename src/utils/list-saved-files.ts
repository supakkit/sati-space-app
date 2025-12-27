import { Paths, Directory } from "expo-file-system";
import { CUSTOM_SOUND_DIRECTORY } from "./storage";

export const listSavedFiles = () => {
  try {
    // Create a Directory instance for the permanent storage
    const soundDir = new Directory(Paths.document, CUSTOM_SOUND_DIRECTORY);

    if (!soundDir.exists) return;

    // Get the contents (returns an array of File/Directory objects)
    const files = soundDir.list();

    console.log(`Found ${files.length} items in Documents:`);

    files.forEach((item, index) => {
      console.log(`${index + 1}: ${item.uri}`);
    });
  } catch (err) {
    console.error("Error reading directory:", err);
  }
};

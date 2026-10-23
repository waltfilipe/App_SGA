import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEMO_ATHLETES, DEMO_VIDEOS } from '@/lib/demoData';
import type { PersistedAppState } from '@/types';
import { DEFAULT_DRIVE_FOLDER_ID } from '@/types';

const STORAGE_KEY = '@video-atletas/v1';

export const defaultPersistedState = (): PersistedAppState => ({
  athletes: DEMO_ATHLETES,
  videos: DEMO_VIDEOS,
  driveFolderId: DEFAULT_DRIVE_FOLDER_ID,
  lastSyncAt: null,
});

export async function loadPersistedState(): Promise<PersistedAppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultPersistedState();
    }
    const parsed = JSON.parse(raw) as PersistedAppState;
    return {
      ...defaultPersistedState(),
      ...parsed,
      athletes: parsed.athletes?.length ? parsed.athletes : DEMO_ATHLETES,
      videos: parsed.videos?.length ? parsed.videos : DEMO_VIDEOS,
    };
  } catch {
    return defaultPersistedState();
  }
}

export async function savePersistedState(state: PersistedAppState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as AuthSession from 'expo-auth-session';

import { getGoogleClientId, useGoogleDriveAuth } from '@/lib/googleAuth';
import { getDriveVideoStreamUrl, listDriveVideos, mergeDriveVideos } from '@/lib/googleDrive';
import { createId } from '@/lib/format';
import { loadPersistedState, savePersistedState } from '@/lib/storage';
import type { Athlete, PersistedAppState, VideoItem } from '@/types';

type AppContextValue = {
  ready: boolean;
  athletes: Athlete[];
  videos: VideoItem[];
  driveAccessToken: string | null;
  driveFolderId: string;
  lastSyncAt: string | null;
  syncing: boolean;
  addAthlete: (input: Omit<Athlete, 'id' | 'createdAt'>) => void;
  updateAthlete: (id: string, patch: Partial<Omit<Athlete, 'id' | 'createdAt'>>) => void;
  removeAthlete: (id: string) => void;
  assignVideo: (videoId: string, athleteId: string | null) => void;
  setDriveFolderId: (folderId: string) => void;
  connectGoogleDrive: () => Promise<void>;
  disconnectGoogleDrive: () => void;
  syncFromDrive: () => Promise<void>;
  getAthleteById: (id: string) => Athlete | undefined;
  getVideoById: (id: string) => VideoItem | undefined;
  getVideosForAthlete: (athleteId: string) => VideoItem[];
  unassignedVideos: VideoItem[];
  resolvePlaybackUrl: (video: VideoItem) => Promise<string | null>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [persisted, setPersisted] = useState<PersistedAppState | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const { request, response, promptAsync, redirectUri } = useGoogleDriveAuth();

  useEffect(() => {
    loadPersistedState().then((state) => {
      setPersisted(state);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!persisted || !ready) return;
    void savePersistedState(persisted);
  }, [persisted, ready]);

  useEffect(() => {
    if (response?.type !== 'success' || !response.params.code) return;
    const clientId = getGoogleClientId();
    if (!clientId || !request?.codeVerifier) return;

    void AuthSession.exchangeCodeAsync(
      {
        clientId,
        code: response.params.code,
        redirectUri,
        extraParams: { code_verifier: request.codeVerifier },
      },
      {
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
      },
    ).then((token) => {
      if (token.accessToken) {
        setDriveAccessToken(token.accessToken);
      }
    });
  }, [redirectUri, request?.codeVerifier, response]);

  const patchPersisted = useCallback((updater: (prev: PersistedAppState) => PersistedAppState) => {
    setPersisted((prev) => (prev ? updater(prev) : prev));
  }, []);

  const addAthlete = useCallback(
    (input: Omit<Athlete, 'id' | 'createdAt'>) => {
      patchPersisted((prev) => ({
        ...prev,
        athletes: [
          ...prev.athletes,
          {
            ...input,
            id: createId('athlete'),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [patchPersisted],
  );

  const updateAthlete = useCallback(
    (id: string, patch: Partial<Omit<Athlete, 'id' | 'createdAt'>>) => {
      patchPersisted((prev) => ({
        ...prev,
        athletes: prev.athletes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      }));
    },
    [patchPersisted],
  );

  const removeAthlete = useCallback(
    (id: string) => {
      patchPersisted((prev) => ({
        ...prev,
        athletes: prev.athletes.filter((a) => a.id !== id),
        videos: prev.videos.map((v) => (v.athleteId === id ? { ...v, athleteId: null } : v)),
      }));
    },
    [patchPersisted],
  );

  const assignVideo = useCallback(
    (videoId: string, athleteId: string | null) => {
      patchPersisted((prev) => ({
        ...prev,
        videos: prev.videos.map((v) => (v.id === videoId ? { ...v, athleteId } : v)),
      }));
    },
    [patchPersisted],
  );

  const setDriveFolderId = useCallback(
    (folderId: string) => {
      patchPersisted((prev) => ({ ...prev, driveFolderId: folderId.trim() || 'root' }));
    },
    [patchPersisted],
  );

  const connectGoogleDrive = useCallback(async () => {
    if (!request) {
      throw new Error('Configure EXPO_PUBLIC_GOOGLE_CLIENT_ID para conectar ao Drive.');
    }
    await promptAsync();
  }, [promptAsync, request]);

  const disconnectGoogleDrive = useCallback(() => {
    setDriveAccessToken(null);
  }, []);

  const syncFromDrive = useCallback(async () => {
    if (!driveAccessToken || !persisted) {
      throw new Error('Conecte-se ao Google Drive antes de sincronizar.');
    }
    setSyncing(true);
    try {
      const fromDrive = await listDriveVideos(driveAccessToken, persisted.driveFolderId);
      patchPersisted((prev) => ({
        ...prev,
        videos: mergeDriveVideos(prev.videos, fromDrive),
        lastSyncAt: new Date().toISOString(),
      }));
    } finally {
      setSyncing(false);
    }
  }, [driveAccessToken, patchPersisted, persisted]);

  const getAthleteById = useCallback(
    (id: string) => persisted?.athletes.find((a) => a.id === id),
    [persisted],
  );

  const getVideoById = useCallback(
    (id: string) => persisted?.videos.find((v) => v.id === id),
    [persisted],
  );

  const getVideosForAthlete = useCallback(
    (athleteId: string) => persisted?.videos.filter((v) => v.athleteId === athleteId) ?? [],
    [persisted],
  );

  const unassignedVideos = useMemo(
    () => persisted?.videos.filter((v) => !v.athleteId) ?? [],
    [persisted],
  );

  const resolvePlaybackUrl = useCallback(
    async (video: VideoItem): Promise<string | null> => {
      if (video.streamUrl) return video.streamUrl;
      if (video.source === 'drive' && driveAccessToken) {
        try {
          return await getDriveVideoStreamUrl(driveAccessToken, video.driveFileId);
        } catch {
          return video.webViewLink ?? null;
        }
      }
      return video.webViewLink ?? null;
    },
    [driveAccessToken],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      athletes: persisted?.athletes ?? [],
      videos: persisted?.videos ?? [],
      driveAccessToken,
      driveFolderId: persisted?.driveFolderId ?? 'root',
      lastSyncAt: persisted?.lastSyncAt ?? null,
      syncing,
      addAthlete,
      updateAthlete,
      removeAthlete,
      assignVideo,
      setDriveFolderId,
      connectGoogleDrive,
      disconnectGoogleDrive,
      syncFromDrive,
      getAthleteById,
      getVideoById,
      getVideosForAthlete,
      unassignedVideos,
      resolvePlaybackUrl,
    }),
    [
      ready,
      persisted,
      driveAccessToken,
      syncing,
      addAthlete,
      updateAthlete,
      removeAthlete,
      assignVideo,
      setDriveFolderId,
      connectGoogleDrive,
      disconnectGoogleDrive,
      syncFromDrive,
      getAthleteById,
      getVideoById,
      getVideosForAthlete,
      unassignedVideos,
      resolvePlaybackUrl,
    ],
  );

  if (!ready) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return ctx;
}

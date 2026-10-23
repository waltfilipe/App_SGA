export type Athlete = {
  id: string;
  name: string;
  sport: string;
  notes: string;
  createdAt: string;
};

export type VideoItem = {
  id: string;
  driveFileId: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  streamUrl?: string;
  athleteId: string | null;
  createdTime?: string;
  sizeBytes?: number;
  source: 'demo' | 'drive';
};

export type PersistedAppState = {
  athletes: Athlete[];
  videos: VideoItem[];
  driveFolderId: string;
  lastSyncAt: string | null;
};

export const DEFAULT_DRIVE_FOLDER_ID = 'root';

import type { VideoItem } from '@/types';

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
};

type DriveListResponse = {
  files?: DriveFile[];
  nextPageToken?: string;
};

function videoQuery(folderId: string): string {
  const parent = folderId === 'root' ? "'root' in parents" : `'${folderId}' in parents`;
  return `${parent} and trashed = false and mimeType contains 'video/'`;
}

export async function listDriveVideos(
  accessToken: string,
  folderId: string,
): Promise<VideoItem[]> {
  const fields =
    'nextPageToken,files(id,name,mimeType,thumbnailLink,webViewLink,createdTime,size)';
  const q = encodeURIComponent(videoQuery(folderId));
  const items: VideoItem[] = [];
  let pageToken: string | undefined;

  do {
    const tokenPart = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${encodeURIComponent(fields)}&pageSize=100${tokenPart}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Drive API (${response.status}): ${body.slice(0, 200)}`);
    }

    const data = (await response.json()) as DriveListResponse;
    for (const file of data.files ?? []) {
      items.push({
        id: `drive-${file.id}`,
        driveFileId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        thumbnailLink: file.thumbnailLink,
        webViewLink: file.webViewLink,
        athleteId: null,
        createdTime: file.createdTime,
        sizeBytes: file.size ? Number(file.size) : undefined,
        source: 'drive',
      });
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

export async function getDriveVideoStreamUrl(
  accessToken: string,
  fileId: string,
): Promise<string> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: 'HEAD',
  });

  if (!response.ok) {
    throw new Error('Não foi possível obter o vídeo do Drive. Verifique permissões.');
  }

  return url;
}

export function mergeDriveVideos(
  existing: VideoItem[],
  fromDrive: VideoItem[],
): VideoItem[] {
  const byDriveId = new Map(existing.map((v) => [v.driveFileId, v]));
  const merged: VideoItem[] = [];

  for (const incoming of fromDrive) {
    const prev = byDriveId.get(incoming.driveFileId);
    if (prev) {
      merged.push({
        ...incoming,
        id: prev.id,
        athleteId: prev.athleteId,
      });
      byDriveId.delete(incoming.driveFileId);
    } else {
      merged.push(incoming);
    }
  }

  for (const leftover of byDriveId.values()) {
    if (leftover.source === 'demo') {
      merged.push(leftover);
    }
  }

  return merged.sort((a, b) => {
    const ta = a.createdTime ? Date.parse(a.createdTime) : 0;
    const tb = b.createdTime ? Date.parse(b.createdTime) : 0;
    return tb - ta;
  });
}

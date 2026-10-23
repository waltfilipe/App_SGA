import type { Athlete, VideoItem } from '@/types';

export const DEMO_ATHLETES: Athlete[] = [
  {
    id: 'demo-athlete-1',
    name: 'Ana Silva',
    sport: 'Vôlei',
    notes: 'Atacante — foco em recepção e ataque.',
    createdAt: new Date('2025-09-01').toISOString(),
  },
  {
    id: 'demo-athlete-2',
    name: 'Bruno Costa',
    sport: 'Futebol',
    notes: 'Meia — análise de passes e finalização.',
    createdAt: new Date('2025-09-05').toISOString(),
  },
  {
    id: 'demo-athlete-3',
    name: 'Carla Mendes',
    sport: 'Atletismo',
    notes: '100m — técnica de saída e sprint.',
    createdAt: new Date('2025-09-10').toISOString(),
  },
];

/** Vídeos públicos de exemplo (Big Buck Bunny — Blender Foundation). */
export const DEMO_VIDEOS: VideoItem[] = [
  {
    id: 'demo-video-1',
    driveFileId: 'demo-bbb-1',
    name: 'Treino — aquecimento (demo)',
    mimeType: 'video/mp4',
    streamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    athleteId: 'demo-athlete-1',
    createdTime: new Date('2025-10-01').toISOString(),
    source: 'demo',
  },
  {
    id: 'demo-video-2',
    driveFileId: 'demo-bbb-2',
    name: 'Partida — highlights (demo)',
    mimeType: 'video/mp4',
    streamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    athleteId: 'demo-athlete-2',
    createdTime: new Date('2025-10-05').toISOString(),
    source: 'demo',
  },
  {
    id: 'demo-video-3',
    driveFileId: 'demo-bbb-3',
    name: 'Análise técnica — pendente (demo)',
    mimeType: 'video/mp4',
    streamUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    athleteId: null,
    createdTime: new Date('2025-10-12').toISOString(),
    source: 'demo',
  },
];

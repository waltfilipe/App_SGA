import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import type { VideoItem } from '@/types';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import EmptyState from '@/components/EmptyState';
import ScreenScroll from '@/components/ScreenScroll';
import { Text } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';
import { formatBytes, formatDate } from '@/lib/format';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getVideoById, athletes, driveAccessToken, resolvePlaybackUrl } = useApp();
  const video = id ? getVideoById(id) : undefined;

  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!video) return;
    setLoading(true);
    setError(null);
    void resolvePlaybackUrl(video)
      .then((url) => {
        setPlaybackUrl(url);
        if (!url) setError('Não foi possível obter URL de reprodução.');
      })
      .catch(() => setError('Erro ao preparar o vídeo.'))
      .finally(() => setLoading(false));
  }, [resolvePlaybackUrl, video]);

  if (!video) {
    return (
      <>
        <Stack.Screen options={{ title: 'Vídeo' }} />
        <EmptyState title="Vídeo não encontrado" description="Volte para a biblioteca." />
      </>
    );
  }

  const athleteName = video.athleteId
    ? athletes.find((a) => a.id === video.athleteId)?.name
    : null;

  const openExternal = () => {
    const url = video.webViewLink ?? playbackUrl;
    if (url) void Linking.openURL(url);
  };

  return (
    <>
      <Stack.Screen options={{ title: video.name }} />
      <ScreenScroll contentContainerStyle={styles.scroll}>
        <View style={styles.playerWrap}>
          {loading ? (
            <View style={styles.playerPlaceholder}>
              <ActivityIndicator size="large" />
            </View>
          ) : playbackUrl ? (
            <InlineVideoPlayer
              playbackUrl={playbackUrl}
              video={video}
              driveAccessToken={driveAccessToken}
            />
          ) : (
            <View style={styles.playerPlaceholder}>
              <Text style={styles.errorText}>{error ?? 'Indisponível'}</Text>
              {video.webViewLink ? (
                <Pressable onPress={openExternal} style={styles.externalBtn}>
                  <Text style={styles.externalBtnText}>Abrir no Drive</Text>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>

        <Text style={styles.title}>{video.name}</Text>
        <Text style={styles.meta}>
          {athleteName ? `Atleta: ${athleteName}` : 'Sem atleta'} · {formatDate(video.createdTime)}
        </Text>
        <Text style={styles.meta}>
          {formatBytes(video.sizeBytes)} · {video.mimeType}
          {video.source === 'demo' ? ' · demo' : ''}
        </Text>

        {Platform.OS === 'web' && video.webViewLink ? (
          <Pressable onPress={openExternal} style={styles.linkBtn}>
            <Text style={styles.linkBtnText}>Abrir no Google Drive</Text>
          </Pressable>
        ) : null}
      </ScreenScroll>
    </>
  );
}

function InlineVideoPlayer({
  playbackUrl,
  video,
  driveAccessToken,
}: {
  playbackUrl: string;
  video: VideoItem;
  driveAccessToken: string | null;
}) {
  const source = useMemo(() => {
    if (video.source === 'drive' && driveAccessToken && playbackUrl.includes('googleapis.com')) {
      return {
        uri: playbackUrl,
        headers: { Authorization: `Bearer ${driveAccessToken}` },
      };
    }
    return { uri: playbackUrl };
  }, [playbackUrl, driveAccessToken, video.source]);

  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
  });

  return <VideoView style={styles.player} player={player} nativeControls contentFit="contain" />;
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 0,
  },
  playerWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  player: {
    width: '100%',
    height: '100%',
  },
  playerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  externalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  externalBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  linkBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  linkBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});

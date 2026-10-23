import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

import EmptyState from '@/components/EmptyState';
import ScreenScroll from '@/components/ScreenScroll';
import VideoCard from '@/components/VideoCard';
import { Text, View } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';

type Filter = 'all' | 'unassigned';

export default function VideosScreen() {
  const { videos, athletes, unassignedVideos, assignVideo } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const list = filter === 'unassigned' ? unassignedVideos : videos;

  const onAssign = (videoId: string) => {
    if (athletes.length === 0) {
      Alert.alert('Sem atletas', 'Cadastre um atleta antes de associar vídeos.');
      return;
    }
    Alert.alert(
      'Associar a um atleta',
      'Escolha o atleta para este vídeo',
      [
        ...athletes.map((a) => ({
          text: a.name,
          onPress: () => assignVideo(videoId, a.id),
        })),
        { text: 'Remover associação', style: 'destructive', onPress: () => assignVideo(videoId, null) },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  return (
    <ScreenScroll>
      <Text style={styles.title}>Biblioteca de vídeos</Text>
      <Text style={styles.subtitle}>
        Toque em um vídeo para assistir. Segure (web: botão abaixo) para associar a um atleta.
      </Text>

      <View style={styles.filters}>
        <FilterChip label="Todos" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterChip
          label={`Sem atleta (${unassignedVideos.length})`}
          active={filter === 'unassigned'}
          onPress={() => setFilter('unassigned')}
        />
      </View>

      {list.length === 0 ? (
        <EmptyState
          title="Nada por aqui"
          description={
            filter === 'unassigned'
              ? 'Todos os vídeos já estão associados a atletas.'
              : 'Sincronize com o Google Drive ou use os vídeos demo.'
          }
        />
      ) : (
        list.map((v) => (
          <View key={v.id} style={styles.row}>
            <View style={styles.cardWrap}>
              <VideoCard
                video={v}
                subtitle={
                  v.athleteId
                    ? athletes.find((a) => a.id === v.athleteId)?.name ?? 'Atleta'
                    : 'Sem atleta'
                }
              />
            </View>
            <Pressable style={styles.assignBtn} onPress={() => onAssign(v.id)}>
              <Text style={styles.assignBtnText}>Atleta</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScreenScroll>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 14,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    backgroundColor: 'transparent',
  },
  cardWrap: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  assignBtn: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.4)',
  },
  assignBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

import { Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, StyleSheet } from 'react-native';

import EmptyState from '@/components/EmptyState';
import ScreenScroll from '@/components/ScreenScroll';
import VideoCard from '@/components/VideoCard';
import { Text, View } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getAthleteById, getVideosForAthlete, removeAthlete } = useApp();
  const athlete = id ? getAthleteById(id) : undefined;
  const videos = id ? getVideosForAthlete(id) : [];

  if (!athlete) {
    return (
      <>
        <Stack.Screen options={{ title: 'Atleta' }} />
        <EmptyState title="Atleta não encontrado" description="Volte e escolha outro atleta." />
      </>
    );
  }

  const onDelete = () => {
    Alert.alert(
      'Remover atleta',
      `Remover ${athlete.name}? Os vídeos ficarão sem associação.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            removeAthlete(athlete.id);
            Alert.alert('Removido', 'Atleta removido.');
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: athlete.name }} />
      <ScreenScroll>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{athlete.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{athlete.name}</Text>
            <Text style={styles.sport}>{athlete.sport || 'Modalidade não informada'}</Text>
          </View>
        </View>

        {athlete.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Observações</Text>
            <Text style={styles.notesBody}>{athlete.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Vídeos ({videos.length})</Text>
        {videos.length === 0 ? (
          <EmptyState
            title="Nenhum vídeo associado"
            description="Na aba Vídeos, use o botão Atleta para vincular treinos a este atleta."
          />
        ) : (
          videos.map((v) => <VideoCard key={v.id} video={v} />)
        )}

        <Pressable style={styles.danger} onPress={onDelete}>
          <Text style={styles.dangerText}>Remover atleta</Text>
        </Pressable>
      </ScreenScroll>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  headerText: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
  },
  sport: {
    fontSize: 15,
    opacity: 0.7,
    marginTop: 2,
  },
  notes: {
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    marginBottom: 18,
    gap: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  notesBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  danger: {
    marginTop: 24,
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  dangerText: {
    color: '#ef4444',
    fontWeight: '700',
  },
});

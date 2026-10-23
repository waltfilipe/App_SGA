import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import AthleteCard from '@/components/AthleteCard';
import EmptyState from '@/components/EmptyState';
import ScreenScroll from '@/components/ScreenScroll';
import { Text, View } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';

export default function AthletesScreen() {
  const { athletes, getVideosForAthlete } = useApp();

  return (
    <ScreenScroll>
      <View style={styles.header}>
        <Text style={styles.title}>Atletas</Text>
        <Link href="/modal" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Novo</Text>
          </Pressable>
        </Link>
      </View>

      {athletes.length === 0 ? (
        <EmptyState
          title="Cadastre o primeiro atleta"
          description="Use o botão Novo para adicionar nome, modalidade e observações."
        />
      ) : (
        athletes.map((a) => (
          <AthleteCard key={a.id} athlete={a} videoCount={getVideosForAthlete(a.id).length} />
        ))
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

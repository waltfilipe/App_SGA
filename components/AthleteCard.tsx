import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import type { Athlete } from '@/types';

type Props = {
  athlete: Athlete;
  videoCount: number;
};

export default function AthleteCard({ athlete, videoCount }: Props) {
  return (
    <Link href={`/athlete/${athlete.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{athlete.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{athlete.name}</Text>
          <Text style={styles.meta}>
            {athlete.sport || 'Esporte não informado'} · {videoCount}{' '}
            {videoCount === 1 ? 'vídeo' : 'vídeos'}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    opacity: 0.65,
    marginTop: 2,
  },
});

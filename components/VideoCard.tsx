import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { formatDate } from '@/lib/format';
import type { VideoItem } from '@/types';

type Props = {
  video: VideoItem;
  subtitle?: string;
};

export default function VideoCard({ video, subtitle }: Props) {
  return (
    <Link href={`/video/${video.id}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        {video.thumbnailLink ? (
          <Image source={{ uri: video.thumbnailLink }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbLabel}>▶</Text>
          </View>
        )}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {video.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {subtitle ?? formatDate(video.createdTime)}
            {video.source === 'demo' ? ' · demo' : ''}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    marginBottom: 10,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  thumb: {
    width: 88,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  thumbPlaceholder: {
    width: 88,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbLabel: {
    color: '#fff',
    fontSize: 22,
  },
  body: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 4,
  },
});

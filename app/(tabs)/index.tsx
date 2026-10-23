import type { ReactNode } from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import AthleteCard from '@/components/AthleteCard';
import EmptyState from '@/components/EmptyState';
import ScreenScroll from '@/components/ScreenScroll';
import VideoCard from '@/components/VideoCard';
import { Text, View } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';
import { formatDate } from '@/lib/format';

export default function HomeScreen() {
  const {
    athletes,
    videos,
    unassignedVideos,
    driveAccessToken,
    lastSyncAt,
    getVideosForAthlete,
  } = useApp();

  const recentVideos = [...videos]
    .sort((a, b) => Date.parse(b.createdTime ?? '') - Date.parse(a.createdTime ?? ''))
    .slice(0, 5);

  return (
    <ScreenScroll>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Vídeo Atletas</Text>
        <Text style={styles.heroSubtitle}>
          Organize vídeos do Google Drive por atleta — no celular e no computador.
        </Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>
            {driveAccessToken ? 'Drive conectado' : 'Modo demo (sem Drive)'}
          </Text>
          {lastSyncAt ? (
            <Text style={styles.badgeMuted}>Sync: {formatDate(lastSyncAt)}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Atletas" value={String(athletes.length)} />
        <Stat label="Vídeos" value={String(videos.length)} />
        <Stat label="Sem atleta" value={String(unassignedVideos.length)} />
      </View>

      <Section title="Atletas em destaque" actionHref="/athletes" actionLabel="Ver todos">
        {athletes.length === 0 ? (
          <EmptyState
            title="Nenhum atleta cadastrado"
            description="Cadastre atletas para associar treinos e partidas."
          />
        ) : (
          athletes.slice(0, 3).map((a) => (
            <AthleteCard key={a.id} athlete={a} videoCount={getVideosForAthlete(a.id).length} />
          ))
        )}
      </Section>

      <Section title="Vídeos recentes" actionHref="/videos" actionLabel="Biblioteca">
        {recentVideos.length === 0 ? (
          <EmptyState
            title="Sem vídeos ainda"
            description="Conecte o Drive em Configurações e sincronize a pasta de vídeos."
          />
        ) : (
          recentVideos.map((v) => <VideoCard key={v.id} video={v} />)
        )}
      </Section>
    </ScreenScroll>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Link href={actionHref} asChild>
          <Pressable>
            <Text style={styles.sectionLink}>{actionLabel}</Text>
          </Pressable>
        </Link>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.75,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    color: '#2563eb',
  },
  badgeMuted: {
    fontSize: 12,
    opacity: 0.6,
    alignSelf: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  stat: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 14,
  },
});

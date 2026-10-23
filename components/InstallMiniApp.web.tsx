import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/**
 * Banner web: convida a instalar o PWA (mini app na tela inicial).
 * Android/Chrome dispara `beforeinstallprompt`; iOS mostra instruções manuais.
 */
export default function InstallMiniApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBip);
    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  if (Platform.OS !== 'web' || isStandalone || dismissed) {
    return null;
  }

  const onInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setDismissed(true);
  };

  const isIos =
    typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Instalar mini app</Text>
      {deferred ? (
        <>
          <Text style={styles.body}>
            Adicione à tela inicial para abrir como app, sem barra do navegador.
          </Text>
          <Pressable style={styles.primary} onPress={onInstall}>
            <Text style={styles.primaryText}>Instalar agora</Text>
          </Pressable>
        </>
      ) : isIos ? (
        <Text style={styles.body}>
          No Safari: toque em Compartilhar → &quot;Adicionar à Tela de Início&quot;.
        </Text>
      ) : (
        <Text style={styles.body}>
          No Chrome: menu (⋮) → &quot;Instalar app&quot; ou &quot;Adicionar à tela inicial&quot;.
        </Text>
      )}
      <Pressable onPress={() => setDismissed(true)}>
        <Text style={styles.dismiss}>Agora não</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    marginBottom: 14,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.75,
  },
  primary: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  dismiss: {
    fontSize: 13,
    opacity: 0.55,
    marginTop: 4,
  },
});

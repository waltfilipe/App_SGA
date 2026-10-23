import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';

import ScreenScroll from '@/components/ScreenScroll';
import { Text, View } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';
import { formatDate } from '@/lib/format';
import { isGoogleConfigured } from '@/lib/googleAuth';

export default function SettingsScreen() {
  const {
    driveAccessToken,
    driveFolderId,
    lastSyncAt,
    syncing,
    connectGoogleDrive,
    disconnectGoogleDrive,
    syncFromDrive,
    setDriveFolderId,
  } = useApp();

  const [folderDraft, setFolderDraft] = useState(driveFolderId);
  const googleReady = isGoogleConfigured();

  const onConnect = async () => {
    try {
      await connectGoogleDrive();
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Falha ao conectar');
    }
  };

  const onSync = async () => {
    try {
      await syncFromDrive();
      Alert.alert('Sincronizado', 'Vídeos do Drive foram importados para a biblioteca.');
    } catch (e) {
      Alert.alert('Erro na sync', e instanceof Error ? e.message : 'Falha ao sincronizar');
    }
  };

  return (
    <ScreenScroll>
      <Text style={styles.title}>Configurações</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Google Drive</Text>
        <Text style={styles.paragraph}>
          {googleReady
            ? 'Cliente OAuth configurado via EXPO_PUBLIC_GOOGLE_CLIENT_ID.'
            : 'Defina EXPO_PUBLIC_GOOGLE_CLIENT_ID no .env para conectar sua conta Google.'}
        </Text>
        <Text style={styles.status}>
          Status: {driveAccessToken ? 'Conectado' : 'Desconectado'}
        </Text>
        {lastSyncAt ? (
          <Text style={styles.statusMuted}>Última sync: {formatDate(lastSyncAt)}</Text>
        ) : null}

        <View style={styles.row}>
          {!driveAccessToken ? (
            <PrimaryButton label="Conectar Google" onPress={onConnect} disabled={!googleReady} />
          ) : (
            <PrimaryButton label="Desconectar" onPress={disconnectGoogleDrive} variant="muted" />
          )}
          <PrimaryButton
            label={syncing ? 'Sincronizando…' : 'Sincronizar vídeos'}
            onPress={onSync}
            disabled={!driveAccessToken || syncing}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pasta no Drive</Text>
        <Text style={styles.paragraph}>
          Informe o ID da pasta que contém os vídeos dos atletas. Use{' '}
          <Text style={styles.mono}>root</Text> para a raiz do Drive.
        </Text>
        <TextInput
          value={folderDraft}
          onChangeText={setFolderDraft}
          placeholder="root ou ID da pasta"
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <PrimaryButton
          label="Salvar pasta"
          onPress={() => {
            setDriveFolderId(folderDraft);
            Alert.alert('Salvo', 'ID da pasta atualizado.');
          }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Modo demo</Text>
        <Text style={styles.paragraph}>
          Sem conectar o Drive, o app já vem com atletas e vídeos de exemplo para você testar a
          organização por atleta.
        </Text>
      </View>
    </ScreenScroll>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'muted';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'muted' && styles.btnMuted,
        disabled && styles.btnDisabled,
        pressed && !disabled && { opacity: 0.9 },
      ]}>
      <Text style={[styles.btnText, variant === 'muted' && styles.btnTextMuted]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.35)',
    marginBottom: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.75,
  },
  mono: {
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusMuted: {
    fontSize: 13,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.45)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#f8fafc',
  },
  btn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnMuted: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.45)',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnTextMuted: {
    color: '#111',
  },
});

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput } from 'react-native';

import ScreenScroll from '@/components/ScreenScroll';
import { Text, View } from '@/components/Themed';
import { useApp } from '@/context/AppProvider';

export default function AddAthleteModal() {
  const { addAthlete } = useApp();
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [notes, setNotes] = useState('');

  const onSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nome obrigatório', 'Informe o nome do atleta.');
      return;
    }
    addAthlete({ name: trimmed, sport: sport.trim(), notes: notes.trim() });
    router.back();
  };

  return (
    <ScreenScroll>
      <Text style={styles.title}>Novo atleta</Text>
      <Field label="Nome" value={name} onChangeText={setName} placeholder="Ex.: João Pereira" />
      <Field label="Modalidade" value={sport} onChangeText={setSport} placeholder="Ex.: Basquete" />
      <Field
        label="Observações"
        value={notes}
        onChangeText={setNotes}
        placeholder="Posição, objetivos, lesões…"
        multiline
      />
      <View style={styles.actions}>
        <Pressable style={styles.secondary} onPress={() => router.back()}>
          <Text style={styles.secondaryText}>Cancelar</Text>
        </Pressable>
        <Pressable style={styles.primary} onPress={onSave}>
          <Text style={styles.primaryText}>Salvar</Text>
        </Pressable>
      </View>
    </ScreenScroll>
  );
}

function Field({
  label,
  ...inputProps
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        placeholderTextColor="#888"
        style={[styles.input, inputProps.multiline && styles.inputMultiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.7,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.45)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#111',
  },
  inputMultiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  primary: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(128,128,128,0.45)',
  },
  secondaryText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

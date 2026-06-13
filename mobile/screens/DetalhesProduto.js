// screens/DetalhesProduto.js
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ScrollView, Alert, TextInput, Switch,
} from 'react-native';
import * as API from '../services/api';

const C = {
  bg: '#F8F9FA', card: '#FFFFFF', primary: '#D4537E',
  dark: '#5C1E32', border: '#F4C0D1', borderGray: '#E2E8F0',
  text: '#2C2C2A', textMuted: '#94A3B8',
};

export default function DetalhesProduto({ route, navigation }) {
  const { produto } = route.params;
  const [form, setForm] = useState({
    nome:       produto.nome       || '',
    categoria:  produto.categoria  || '',
    preco:      String(produto.preco),
    descricao:  produto.descricao  || '',
    disponivel: produto.disponivel ?? true,
  });
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!form.nome || !form.preco) { Alert.alert('Atenção', 'Nome e preço são obrigatórios.'); return; }
    setSalvando(true);
    try {
      await API.atualizarProduto(produto.id, {
        ...form,
        preco: parseFloat(form.preco),
      });
      Alert.alert('Sucesso', 'Produto atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.titulo}>🍰 {produto.nome}</Text>
      <Text style={s.sub}>ID #{produto.id} · cadastrado em {produto.dataCadastro || '—'}</Text>

      <View style={s.card}>
        <Campo label="Nome *" value={form.nome}
          onChangeText={v => setForm(f => ({...f, nome: v}))} />
        <Campo label="Categoria" value={form.categoria}
          onChangeText={v => setForm(f => ({...f, categoria: v}))} />
        <Campo label="Preço *" value={form.preco} keyboardType="decimal-pad"
          onChangeText={v => setForm(f => ({...f, preco: v}))} />
        <Campo label="Descrição" value={form.descricao} multiline
          onChangeText={v => setForm(f => ({...f, descricao: v}))} />

        <View style={s.switchRow}>
          <Text style={s.formLabel}>Disponível</Text>
          <Switch value={form.disponivel}
            onValueChange={v => setForm(f => ({...f, disponivel: v}))}
            trackColor={{ false: C.borderGray, true: C.border }}
            thumbColor={form.disponivel ? C.primary : C.textMuted} />
        </View>
      </View>

      <View style={s.botoes}>
        <TouchableOpacity style={s.btnVoltar} onPress={() => navigation.goBack()}>
          <Text style={s.btnVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btnSalvar, salvando && { opacity: 0.6 }]}
          onPress={salvar} disabled={salvando}>
          <Text style={s.btnSalvarTexto}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Campo({ label, multiline, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.formLabel}>{label}</Text>
      <TextInput
        style={[s.formControl, multiline && { height: 80, textAlignVertical: 'top' }]}
        placeholderTextColor={C.textMuted}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 20 },
  titulo:     { fontSize: 24, fontWeight: 'bold', color: C.dark, fontFamily: 'serif', marginBottom: 4 },
  sub:        { fontSize: 13, color: C.textMuted, marginBottom: 20 },
  card:       { backgroundColor: C.card, borderRadius: 12, padding: 20,
                borderWidth: 1, borderColor: C.borderGray, marginBottom: 20 },
  formLabel:  { fontWeight: 'bold', color: C.dark, marginBottom: 6, fontSize: 15 },
  formControl: { backgroundColor: C.bg, color: C.text, borderRadius: 6, padding: 12,
                 fontSize: 15, borderWidth: 1, borderColor: C.border },
  switchRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  botoes:     { flexDirection: 'row', gap: 12 },
  btnSalvar:  { flex: 1, backgroundColor: C.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  btnSalvarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnVoltar:  { flex: 1, backgroundColor: C.card, padding: 16, borderRadius: 8,
                alignItems: 'center', borderWidth: 1, borderColor: C.borderGray },
  btnVoltarTexto: { color: C.textMuted, fontWeight: 'bold', fontSize: 16 },
});
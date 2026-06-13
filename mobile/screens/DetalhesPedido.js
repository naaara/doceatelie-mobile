// screens/DetalhesPedido.js
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

const STATUS_LIST  = ['Pendente', 'Pronto', 'Entregue', 'Cancelado'];
const STATUS_CORES = {
  Pendente: '#D4537E', Pronto: '#34D399', Entregue: '#60A5FA', Cancelado: '#EF4444',
};

export default function DetalhesPedido({ route, navigation }) {
  const { pedido } = route.params;
  const [form, setForm] = useState({
    status:     pedido.status      || 'Pendente',
    valorTotal: String(pedido.valorTotal),
    observacao: pedido.observacao  || '',
    entrega:    pedido.entrega     ?? false,
  });
  const [salvando, setSalvando] = useState(false);

  const dataFormatada = pedido.dataPedido
    ? new Date(pedido.dataPedido).toLocaleString('pt-BR')
    : '—';

  async function salvar() {
    setSalvando(true);
    try {
      await API.atualizarPedido(pedido.id, {
        ...form,
        valorTotal: parseFloat(form.valorTotal),
        cliente: { id: pedido.cliente.id },
      });
      Alert.alert('Sucesso', 'Pedido atualizado!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setSalvando(false);
    }
  }

  const corStatus = STATUS_CORES[form.status] || C.textMuted;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cabeçalho */}
      <View style={s.cabecalho}>
        <View style={{ flex: 1 }}>
          <Text style={s.titulo}>Pedido #{pedido.id}</Text>
          <Text style={s.sub}>{dataFormatada}</Text>
        </View>
        <View style={[s.badgeGrande, { backgroundColor: corStatus + '22', borderColor: corStatus }]}>
          <Text style={[s.badgeGrandeTexto, { color: corStatus }]}>{form.status}</Text>
        </View>
      </View>

      {/* Info do cliente */}
      <View style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
        <View style={s.avatar}>
          <Text style={s.avatarLetra}>{pedido.cliente?.nome?.[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={s.clienteNome}>{pedido.cliente?.nome}</Text>
          <Text style={s.sub}>ID #{pedido.cliente?.id}</Text>
        </View>
      </View>

      {/* Formulário de edição */}
      <View style={s.card}>
        {/* Status — chips clicáveis */}
        <Text style={s.formLabel}>Status</Text>
        <View style={s.chips}>
          {STATUS_LIST.map(st => {
            const cor = STATUS_CORES[st];
            const ativo = form.status === st;
            return (
              <TouchableOpacity key={st}
                style={[s.chip, { borderColor: cor, backgroundColor: ativo ? cor : C.card }]}
                onPress={() => setForm(f => ({...f, status: st}))}>
                <Text style={[s.chipTexto, { color: ativo ? '#fff' : cor }]}>{st}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={s.formLabel}>Valor total *</Text>
          <TextInput style={s.formControl} keyboardType="decimal-pad"
            value={form.valorTotal} placeholderTextColor={C.textMuted}
            onChangeText={v => setForm(f => ({...f, valorTotal: v}))} />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={s.formLabel}>Observação</Text>
          <TextInput style={[s.formControl, { height: 80, textAlignVertical: 'top' }]}
            multiline value={form.observacao} placeholderTextColor={C.textMuted}
            onChangeText={v => setForm(f => ({...f, observacao: v}))} />
        </View>

        <View style={s.switchRow}>
          <Text style={s.formLabel}>Com entrega</Text>
          <Switch value={form.entrega}
            onValueChange={v => setForm(f => ({...f, entrega: v}))}
            trackColor={{ false: C.borderGray, true: C.border }}
            thumbColor={form.entrega ? C.primary : C.textMuted} />
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

const s = StyleSheet.create({
  container:       { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 20 },
  cabecalho:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  titulo:          { fontSize: 24, fontWeight: 'bold', color: C.dark, fontFamily: 'serif' },
  sub:             { fontSize: 13, color: C.textMuted, marginTop: 2 },
  badgeGrande:     { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1.5 },
  badgeGrandeTexto: { fontWeight: 'bold', fontSize: 13 },
  card:            { backgroundColor: C.card, borderRadius: 12, padding: 20,
                     borderWidth: 1, borderColor: C.borderGray, marginBottom: 16 },
  avatar:          { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FDF2F5',
                     alignItems: 'center', justifyContent: 'center',
                     borderWidth: 1, borderColor: C.border },
  avatarLetra:     { color: C.dark, fontWeight: 'bold', fontSize: 20, fontFamily: 'serif' },
  clienteNome:     { color: C.text, fontWeight: 'bold', fontSize: 16 },
  formLabel:       { fontWeight: 'bold', color: C.dark, marginBottom: 8, fontSize: 15 },
  formControl:     { backgroundColor: C.bg, color: C.text, borderRadius: 6, padding: 12,
                     fontSize: 15, borderWidth: 1, borderColor: C.border },
  chips:           { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:            { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  chipTexto:       { fontWeight: '700', fontSize: 13 },
  switchRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  botoes:          { flexDirection: 'row', gap: 12 },
  btnSalvar:       { flex: 1, backgroundColor: C.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  btnSalvarTexto:  { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnVoltar:       { flex: 1, backgroundColor: C.card, padding: 16, borderRadius: 8,
                     alignItems: 'center', borderWidth: 1, borderColor: C.borderGray },
  btnVoltarTexto:  { color: C.textMuted, fontWeight: 'bold', fontSize: 16 },
});
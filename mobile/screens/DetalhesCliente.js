// screens/DetalhesCliente.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ScrollView, Alert, TextInput, Switch, ActivityIndicator,
} from 'react-native';
import * as API from '../services/api';

const C = {
  bg: '#F8F9FA', card: '#FFFFFF', primary: '#D4537E',
  dark: '#5C1E32', border: '#F4C0D1', borderGray: '#E2E8F0',
  text: '#2C2C2A', textMuted: '#94A3B8',
};

const STATUS_CORES = {
  Pendente: '#D4537E', Pronto: '#34D399', Entregue: '#60A5FA', Cancelado: '#EF4444',
};

export default function DetalhesCliente({ route, navigation }) {
  const { cliente } = route.params;
  const [form, setForm] = useState({
    nome:          cliente.nome          || '',
    email:         cliente.email         || '',
    telefone:      cliente.telefone      || '',
    cpf:           cliente.cpf           || '',
    dataNascimento: cliente.dataNascimento || '',
    ativo:         cliente.ativo         ?? true,
  });
  const [pedidos, setPedidos]   = useState([]);
  const [loadPed, setLoadPed]   = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    API.listarPedidosPorCliente(cliente.id)
      .then(setPedidos)
      .catch(() => {})
      .finally(() => setLoadPed(false));
  }, []);

  async function salvar() {
    if (!form.nome || !form.cpf) { Alert.alert('Atenção', 'Nome e CPF são obrigatórios.'); return; }
    setSalvando(true);
    try {
      await API.atualizarCliente(cliente.id, form);
      Alert.alert('Sucesso', 'Cliente atualizado!', [
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
      {/* Avatar + nome */}
      <View style={s.avatarRow}>
        <View style={s.avatar}>
          <Text style={s.avatarLetra}>{cliente.nome?.[0]?.toUpperCase()}</Text>
        </View>
        <View>
          <Text style={s.titulo}>{cliente.nome}</Text>
          <Text style={s.sub}>ID #{cliente.id}</Text>
        </View>
      </View>

      {/* Formulário */}
      <View style={s.card}>
        <Campo label="Nome *" value={form.nome}
          onChangeText={v => setForm(f => ({...f, nome: v}))} />
        <Campo label="CPF *" value={form.cpf}
          onChangeText={v => setForm(f => ({...f, cpf: v}))} />
        <Campo label="Telefone" value={form.telefone}
          onChangeText={v => setForm(f => ({...f, telefone: v}))} />
        <Campo label="E-mail" value={form.email} keyboardType="email-address"
          onChangeText={v => setForm(f => ({...f, email: v}))} />
        <Campo label="Data de nascimento (AAAA-MM-DD)" value={form.dataNascimento}
          onChangeText={v => setForm(f => ({...f, dataNascimento: v}))} />
        <View style={s.switchRow}>
          <Text style={s.formLabel}>Ativo</Text>
          <Switch value={form.ativo}
            onValueChange={v => setForm(f => ({...f, ativo: v}))}
            trackColor={{ false: C.borderGray, true: C.border }}
            thumbColor={form.ativo ? C.primary : C.textMuted} />
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

      {/* Histórico de pedidos */}
      <Text style={s.secao}>📦 Pedidos deste cliente</Text>
      {loadPed ? (
        <ActivityIndicator color={C.primary} />
      ) : pedidos.length === 0 ? (
        <Text style={s.vazio}>Nenhum pedido encontrado.</Text>
      ) : (
        pedidos.map(p => {
          const cor = STATUS_CORES[p.status] || C.textMuted;
          return (
            <TouchableOpacity key={p.id} style={s.pedidoCard}
              onPress={() => navigation.navigate('DetalhesPedido', { pedido: p })}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={s.pedidoNome}>Pedido #{p.id}</Text>
                  <View style={[s.badge, { backgroundColor: cor + '22' }]}>
                    <Text style={[s.badgeTexto, { color: cor }]}>{p.status}</Text>
                  </View>
                </View>
                <Text style={s.pedidoSub}>{p.entrega ? '🚚 Entrega' : '🏠 Retirada'}</Text>
                <Text style={s.pedidoPreco}>R$ {parseFloat(p.valorTotal).toFixed(2)}</Text>
              </View>
              <Text style={s.seta}>›</Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

function Campo({ label, multiline, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.formLabel}>{label}</Text>
      <TextInput style={[s.formControl, multiline && { height: 80, textAlignVertical: 'top' }]}
        placeholderTextColor={C.textMuted} multiline={multiline} {...props} />
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 20 },
  avatarRow:   { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar:      { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FDF2F5',
                 alignItems: 'center', justifyContent: 'center',
                 borderWidth: 2, borderColor: C.border },
  avatarLetra: { color: C.dark, fontWeight: 'bold', fontSize: 26, fontFamily: 'serif' },
  titulo:      { fontSize: 22, fontWeight: 'bold', color: C.dark, fontFamily: 'serif' },
  sub:         { fontSize: 13, color: C.textMuted, marginTop: 2 },
  card:        { backgroundColor: C.card, borderRadius: 12, padding: 20,
                 borderWidth: 1, borderColor: C.borderGray, marginBottom: 20 },
  formLabel:   { fontWeight: 'bold', color: C.dark, marginBottom: 6, fontSize: 15 },
  formControl: { backgroundColor: C.bg, color: C.text, borderRadius: 6, padding: 12,
                 fontSize: 15, borderWidth: 1, borderColor: C.border },
  switchRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  botoes:      { flexDirection: 'row', gap: 12, marginBottom: 28 },
  btnSalvar:   { flex: 1, backgroundColor: C.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  btnSalvarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnVoltar:   { flex: 1, backgroundColor: C.card, padding: 16, borderRadius: 8,
                 alignItems: 'center', borderWidth: 1, borderColor: C.borderGray },
  btnVoltarTexto: { color: C.textMuted, fontWeight: 'bold', fontSize: 16 },
  secao:       { fontSize: 17, fontWeight: 'bold', color: C.dark, fontFamily: 'serif', marginBottom: 12 },
  vazio:       { color: C.textMuted, fontStyle: 'italic', fontSize: 14 },
  pedidoCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
                 padding: 14, borderRadius: 10, marginBottom: 10,
                 borderWidth: 1, borderColor: C.borderGray },
  pedidoNome:  { color: C.text, fontWeight: 'bold', fontSize: 14 },
  pedidoSub:   { color: C.textMuted, fontSize: 12, marginTop: 3 },
  pedidoPreco: { color: C.primary, fontWeight: 'bold', fontSize: 15, marginTop: 4 },
  badge:       { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeTexto:  { fontSize: 11, fontWeight: '700' },
  seta:        { fontSize: 22, color: C.border, fontWeight: 'bold' },
});
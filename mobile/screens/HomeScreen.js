import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Modal, TextInput,
} from 'react-native';
import * as API from '../services/api';

const C = {
  bg:         '#F8F9FA',
  card:       '#FFFFFF',
  cardAlt:    '#FCF9FA',
  primary:    '#D4537E',
  dark:       '#5C1E32',
  border:     '#F4C0D1',
  borderGray: '#E2E8F0',
  text:       '#2C2C2A',
  textMuted:  '#94A3B8',
};

const ABAS = [
  { key: 'produtos', label: 'Produtos', emoji: '🍰' },
  { key: 'clientes', label: 'Clientes', emoji: '👤' },
  { key: 'pedidos',  label: 'Pedidos',  emoji: '📦' },
];

const STATUS_CORES = {
  Pendente:  '#D4537E',
  Pronto:    '#34D399',
  Entregue:  '#60A5FA',
  Cancelado: '#EF4444',
};

export default function HomeScreen({ navigation }) {
  const [abaAtiva, setAbaAtiva]         = useState('produtos');
  const [loading, setLoading]           = useState(false);
  const [dados, setDados]               = useState({ produtos: [], clientes: [], pedidos: [] });
  const [modalVisivel, setModalVisivel] = useState(false);
  const [form, setForm]                 = useState({});
  const [clientes, setClientes]         = useState([]);

  const carregar = useCallback(async (aba = abaAtiva) => {
    setLoading(true);
    try {
      let resultado;
      if (aba === 'produtos') resultado = await API.listarProdutos();
      if (aba === 'clientes') resultado = await API.listarClientes();
      if (aba === 'pedidos')  resultado = await API.listarPedidos();
      setDados(prev => ({ ...prev, [aba]: resultado }));
    } catch (e) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }, [abaAtiva]);

  useEffect(() => { carregar(abaAtiva); }, [abaAtiva]);

  async function abrirModal() {
    setForm({});
    if (abaAtiva === 'pedidos') {
      try {
        const lista = await API.listarClientes();
        setClientes(lista);
      } catch (_) {}
    }
    setModalVisivel(true);
  }

  async function salvar() {
    try {
      if (abaAtiva === 'produtos') {
        if (!form.nome || !form.preco) { Alert.alert('Atenção', 'Nome e preço são obrigatórios.'); return; }
        await API.criarProduto({ ...form, preco: parseFloat(form.preco), disponivel: true });
      }
      if (abaAtiva === 'clientes') {
        if (!form.nome || !form.cpf) { Alert.alert('Atenção', 'Nome e CPF são obrigatórios.'); return; }
        await API.criarCliente({ ...form, ativo: true });
      }
      if (abaAtiva === 'pedidos') {
        if (!form.clienteId || !form.valorTotal) { Alert.alert('Atenção', 'Cliente e valor total são obrigatórios.'); return; }
        await API.criarPedido({
          valorTotal: parseFloat(form.valorTotal),
          observacao: form.observacao || '',
          entrega: form.entrega === 'true',
          cliente: { id: parseInt(form.clienteId) },
        });
      }
      setModalVisivel(false);
      carregar(abaAtiva);
    } catch (e) {
      Alert.alert('Erro ao salvar', e.message);
    }
  }

  function confirmarExclusao(id) {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            if (abaAtiva === 'produtos') await API.excluirProduto(id);
            if (abaAtiva === 'clientes') await API.excluirCliente(id);
            if (abaAtiva === 'pedidos')  await API.excluirPedido(id);
            carregar(abaAtiva);
          } catch (e) { Alert.alert('Erro', e.message); }
        },
      },
    ]);
  }

  function irParaDetalhe(item) {
    if (abaAtiva === 'produtos') navigation.navigate('DetalhesProduto', { produto: item });
    if (abaAtiva === 'clientes') navigation.navigate('DetalhesCliente', { cliente: item });
    if (abaAtiva === 'pedidos')  navigation.navigate('DetalhesPedido',  { pedido: item });
  }

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.titulo}>Doce Ateliê</Text>
          <Text style={s.subtitulo}>Gestão do ateliê</Text>
        </View>
        <TouchableOpacity style={s.btnNovo} onPress={abrirModal}>
          <Text style={s.btnNovoTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Abas */}
      <View style={s.abas}>
        {ABAS.map(({ key, label, emoji }) => {
          const ativa = abaAtiva === key;
          return (
            <TouchableOpacity key={key} activeOpacity={0.75}
              style={[s.cardAba, ativa && s.cardAbaAtiva]}
              onPress={() => setAbaAtiva(key)}>
              <Text style={s.abaEmoji}>{emoji}</Text>
              <Text style={[s.abaLabel, ativa && s.abaLabelAtiva]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.divisor} />

      {loading ? (
        <ActivityIndicator color={C.primary} size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* PRODUTOS */}
          {abaAtiva === 'produtos' && dados.produtos.map((p, i) => (
            <TouchableOpacity key={p.id} activeOpacity={0.8}
              style={[s.itemCard, i % 2 === 1 && s.itemCardAlt]}
              onPress={() => irParaDetalhe(p)}>
              <View style={{ flex: 1 }}>
                <View style={s.itemTopo}>
                  <Text style={s.itemNome}>{p.nome}</Text>
                  <View style={[s.badge, { backgroundColor: p.disponivel ? '#DCFCE7' : '#FEE2E2' }]}>
                    <Text style={[s.badgeTexto, { color: p.disponivel ? '#166534' : '#991B1B' }]}>
                      {p.disponivel ? 'Disponível' : 'Indisponível'}
                    </Text>
                  </View>
                </View>
                {!!p.categoria && <Text style={s.itemSub}>{p.categoria}</Text>}
                {!!p.descricao && <Text style={s.itemDesc} numberOfLines={2}>{p.descricao}</Text>}
                <Text style={s.itemPreco}>R$ {parseFloat(p.preco).toFixed(2)}</Text>
              </View>
              <View style={s.acoes}>
                <TouchableOpacity onPress={() => confirmarExclusao(p.id)} style={s.btnAcao}>
                  <Text>🗑</Text>
                </TouchableOpacity>
                <Text style={s.seta}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* CLIENTES */}
          {abaAtiva === 'clientes' && dados.clientes.map((c, i) => (
            <TouchableOpacity key={c.id} activeOpacity={0.8}
              style={[s.itemCard, i % 2 === 1 && s.itemCardAlt]}
              onPress={() => irParaDetalhe(c)}>
              <View style={s.avatar}>
                <Text style={s.avatarLetra}>{c.nome?.[0]?.toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.itemNome}>{c.nome}</Text>
                {!!c.telefone && <Text style={s.itemSub}>📞 {c.telefone}</Text>}
                {!!c.email    && <Text style={s.itemSub}>✉️  {c.email}</Text>}
                <Text style={[s.itemSub, { fontSize: 12 }]}>CPF: {c.cpf}</Text>
              </View>
              <View style={s.acoes}>
                <TouchableOpacity onPress={() => confirmarExclusao(c.id)} style={s.btnAcao}>
                  <Text>🗑</Text>
                </TouchableOpacity>
                <Text style={s.seta}>›</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* PEDIDOS */}
          {abaAtiva === 'pedidos' && dados.pedidos.map((p, i) => {
            const cor = STATUS_CORES[p.status] || C.textMuted;
            return (
              <TouchableOpacity key={p.id} activeOpacity={0.8}
                style={[s.itemCard, i % 2 === 1 && s.itemCardAlt]}
                onPress={() => irParaDetalhe(p)}>
                <View style={{ flex: 1 }}>
                  <View style={s.itemTopo}>
                    <Text style={s.itemNome}>Pedido #{p.id}</Text>
                    <View style={[s.badge, { backgroundColor: cor + '22' }]}>
                      <Text style={[s.badgeTexto, { color: cor }]}>{p.status}</Text>
                    </View>
                  </View>
                  <Text style={s.itemSub}>👤 {p.cliente?.nome}</Text>
                  <Text style={s.itemSub}>{p.entrega ? '🚚 Com entrega' : '🏠 Retirada'}</Text>
                  <Text style={s.itemPreco}>R$ {parseFloat(p.valorTotal).toFixed(2)}</Text>
                </View>
                <View style={s.acoes}>
                  <TouchableOpacity onPress={() => confirmarExclusao(p.id)} style={s.btnAcao}>
                    <Text>🗑</Text>
                  </TouchableOpacity>
                  <Text style={s.seta}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {dados[abaAtiva]?.length === 0 && !loading && (
            <Text style={s.vazio}>Nenhum registro encontrado.</Text>
          )}

          <TouchableOpacity style={s.btnRefazer} onPress={() => carregar(abaAtiva)}>
            <Text style={s.btnRefazerTexto}>🔄 Recarregar</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal criação */}
      <Modal visible={modalVisivel} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitulo}>
              {abaAtiva === 'produtos' ? '🍰 Novo produto'
                : abaAtiva === 'clientes' ? '👤 Novo cliente' : '📦 Novo pedido'}
            </Text>

            {abaAtiva === 'produtos' && (
              <>
                <Campo label="Nome *" onChangeText={v => setForm(f => ({...f, nome: v}))} />
                <Campo label="Categoria" onChangeText={v => setForm(f => ({...f, categoria: v}))} />
                <Campo label="Preço (ex: 25.90) *" keyboardType="decimal-pad"
                  onChangeText={v => setForm(f => ({...f, preco: v}))} />
                <Campo label="Descrição" onChangeText={v => setForm(f => ({...f, descricao: v}))} />
              </>
            )}
            {abaAtiva === 'clientes' && (
              <>
                <Campo label="Nome *" onChangeText={v => setForm(f => ({...f, nome: v}))} />
                <Campo label="CPF (000.000.000-00) *" onChangeText={v => setForm(f => ({...f, cpf: v}))} />
                <Campo label="Telefone" onChangeText={v => setForm(f => ({...f, telefone: v}))} />
                <Campo label="E-mail" keyboardType="email-address" onChangeText={v => setForm(f => ({...f, email: v}))} />
              </>
            )}
            {abaAtiva === 'pedidos' && (
              <>
                <Text style={s.formLabel}>Cliente *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 12 }}>
                  {clientes.map(c => (
                    <TouchableOpacity key={c.id}
                      style={[s.chipCliente, form.clienteId === String(c.id) && s.chipClienteAtivo]}
                      onPress={() => setForm(f => ({...f, clienteId: String(c.id)}))}>
                      <Text style={[s.chipTexto, form.clienteId === String(c.id) && { color: '#fff' }]}>
                        {c.nome}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Campo label="Valor total (ex: 89.90) *" keyboardType="decimal-pad"
                  onChangeText={v => setForm(f => ({...f, valorTotal: v}))} />
                <Campo label="Observação" onChangeText={v => setForm(f => ({...f, observacao: v}))} />
                <Text style={s.formLabel}>Entrega?</Text>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                  {['Sim', 'Não'].map(op => (
                    <TouchableOpacity key={op}
                      style={[s.chipCliente,
                        (op === 'Sim' ? form.entrega === 'true' : form.entrega === 'false') && s.chipClienteAtivo]}
                      onPress={() => setForm(f => ({...f, entrega: op === 'Sim' ? 'true' : 'false'}))}>
                      <Text style={[s.chipTexto,
                        (op === 'Sim' ? form.entrega === 'true' : form.entrega === 'false') && { color: '#fff' }]}>
                        {op}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={s.modalBotoes}>
              <TouchableOpacity style={s.btnVoltar} onPress={() => setModalVisivel(false)}>
                <Text style={s.btnVoltarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnSalvar} onPress={salvar}>
                <Text style={s.btnSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Campo({ label, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.formLabel}>{label}</Text>
      <TextInput style={s.formControl} placeholderTextColor={C.textMuted} {...props} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.bg, paddingTop: 60, paddingHorizontal: 20 },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  titulo:       { fontSize: 28, fontWeight: 'bold', color: C.dark, fontFamily: 'serif', letterSpacing: -0.5 },
  subtitulo:    { fontSize: 13, color: C.textMuted, marginTop: 2 },
  btnNovo:      { backgroundColor: C.primary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  btnNovoTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },

  abas:         { flexDirection: 'row', gap: 10, marginBottom: 16 },
  cardAba:      { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center',
                  backgroundColor: C.card, borderWidth: 1, borderColor: C.borderGray, elevation: 1 },
  cardAbaAtiva: { backgroundColor: '#FDF2F5', borderColor: C.border, elevation: 2 },
  abaEmoji:     { fontSize: 22, marginBottom: 4 },
  abaLabel:     { fontSize: 11, fontWeight: '700', color: C.textMuted },
  abaLabelAtiva: { color: C.dark },
  divisor:      { height: 2, backgroundColor: C.border, borderRadius: 2, opacity: 0.7, marginBottom: 16 },

  itemCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
                  padding: 16, borderRadius: 12, marginBottom: 10,
                  borderWidth: 1, borderColor: C.borderGray, elevation: 1 },
  itemCardAlt:  { backgroundColor: '#FCF9FA' },
  itemTopo:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  itemNome:     { color: C.text, fontWeight: 'bold', fontSize: 15, flex: 1 },
  itemSub:      { color: C.textMuted, fontSize: 13, marginTop: 3 },
  itemDesc:     { color: C.textMuted, fontSize: 12, marginTop: 4, lineHeight: 18, fontStyle: 'italic' },
  itemPreco:    { color: C.primary, fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  badge:        { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeTexto:   { fontSize: 11, fontWeight: '700' },
  avatar:       { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FDF2F5',
                  alignItems: 'center', justifyContent: 'center', marginRight: 14,
                  borderWidth: 1, borderColor: C.border },
  avatarLetra:  { color: C.dark, fontWeight: 'bold', fontSize: 18, fontFamily: 'serif' },
  acoes:        { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnAcao:      { padding: 6 },
  seta:         { fontSize: 22, color: C.border, fontWeight: 'bold' },
  vazio:        { color: C.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14, fontStyle: 'italic' },
  btnRefazer:   { marginTop: 20, padding: 16, borderRadius: 8, alignItems: 'center',
                  borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  btnRefazerTexto: { color: C.primary, fontWeight: 'bold', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(92,30,50,0.35)', justifyContent: 'flex-end' },
  modalCard:    { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
                  padding: 24, paddingBottom: 40, borderTopWidth: 2, borderColor: C.border },
  modalTitulo:  { color: C.dark, fontSize: 20, fontWeight: 'bold', marginBottom: 20, fontFamily: 'serif' },
  formLabel:    { fontWeight: 'bold', color: C.dark, marginBottom: 5, fontSize: 15 },
  formControl:  { backgroundColor: C.card, color: C.text, borderRadius: 6, padding: 12,
                  fontSize: 15, borderWidth: 1, borderColor: C.border },
  chipCliente:  { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
                  borderColor: C.border, marginRight: 8, backgroundColor: C.card },
  chipClienteAtivo: { backgroundColor: C.primary, borderColor: C.primary },
  chipTexto:    { fontSize: 13, color: C.dark, fontWeight: '600' },
  modalBotoes:  { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnSalvar:    { flex: 1, backgroundColor: C.primary, padding: 14, borderRadius: 6, alignItems: 'center' },
  btnSalvarTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  btnVoltar:    { flex: 1, backgroundColor: C.card, padding: 14, borderRadius: 6,
                  alignItems: 'center', borderWidth: 1, borderColor: C.borderGray },
  btnVoltarTexto: { color: C.textMuted, fontWeight: 'bold', fontSize: 16 },
});
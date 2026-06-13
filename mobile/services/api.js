import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.3.220:8080',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});



api.interceptors.response.use(
  res => res.data,
  err => {
    const msg =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      'Erro desconhecido';
    return Promise.reject(new Error(String(msg)));
  }
);
 
// PRODUTOS
export const listarProdutos            = ()             => api.get('/produtos');
export const listarProdutosDisponiveis = ()             => api.get('/produtos/disponiveis');
export const buscarProduto             = (id)           => api.get(`/produtos/${id}`);
export const criarProduto              = (dados)        => api.post('/produtos', dados);
export const atualizarProduto          = (id, dados)    => api.put(`/produtos/${id}`, dados);
export const excluirProduto            = (id)           => api.delete(`/produtos/${id}`);
 
// CLIENTES
export const listarClientes   = ()           => api.get('/clientes');
export const buscarCliente    = (id)         => api.get(`/clientes/${id}`);
export const criarCliente     = (dados)      => api.post('/clientes', dados);
export const atualizarCliente = (id, dados)  => api.put(`/clientes/${id}`, dados);
export const excluirCliente   = (id)         => api.delete(`/clientes/${id}`);
 
// PEDIDOS
export const listarPedidos           = ()            => api.get('/pedidos');
export const listarPedidosPorCliente = (clienteId)   => api.get(`/pedidos/cliente/${clienteId}`);
export const buscarPedido            = (id)          => api.get(`/pedidos/${id}`);
export const criarPedido             = (dados)       => api.post('/pedidos', dados);
export const atualizarPedido         = (id, dados)   => api.put(`/pedidos/${id}`, dados);
export const excluirPedido           = (id)          => api.delete(`/pedidos/${id}`);
 

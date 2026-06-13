package com.doceatelie.service;

import com.doceatelie.model.Pedido;
import com.doceatelie.model.Cliente;
import com.doceatelie.repository.PedidoRepository;
import com.doceatelie.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public Pedido incluir(Pedido pedido) {
        // Valida e carrega o cliente completo do banco
        Cliente cliente = clienteRepository.findById(pedido.getCliente().getId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));
        pedido.setCliente(cliente);

        if (pedido.getDataPedido() == null) pedido.setDataPedido(LocalDateTime.now());
        if (pedido.getStatus() == null) pedido.setStatus("Pendente");
        if (pedido.getEntrega() == null) pedido.setEntrega(false);

        return pedidoRepository.save(pedido);
    }

    public Pedido alterar(Long id, Pedido pedidoAtualizado) {
        Pedido existente = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado com id: " + id));

        Cliente cliente = clienteRepository.findById(pedidoAtualizado.getCliente().getId())
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado!"));

        existente.setCliente(cliente);
        existente.setValorTotal(pedidoAtualizado.getValorTotal());
        existente.setStatus(pedidoAtualizado.getStatus());
        existente.setObservacao(pedidoAtualizado.getObservacao());
        existente.setEntrega(pedidoAtualizado.getEntrega());
        existente.setDataPedido(pedidoAtualizado.getDataPedido());

        return pedidoRepository.save(existente);
    }

    public void excluir(Long id) {
        if (!pedidoRepository.existsById(id)) {
            throw new RuntimeException("Pedido não encontrado com id: " + id);
        }
        pedidoRepository.deleteById(id);
    }

    public Pedido consultar(Long id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado com id: " + id));
    }

    public List<Pedido> listar() {
        return pedidoRepository.findAllByOrderByDataPedidoDesc();
    }

    public List<Pedido> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }
}
package com.doceatelie.controller;

import com.doceatelie.model.Pedido;
import com.doceatelie.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService service;

    // GET /pedidos — lista todos do mais recente ao mais antigo
    @GetMapping
    public List<Pedido> listar() {
        return service.listar();
    }

    // GET /pedidos/cliente/1 — pedidos de um cliente específico
    @GetMapping("/cliente/{clienteId}")
    public List<Pedido> listarPorCliente(@PathVariable Long clienteId) {
        return service.listarPorCliente(clienteId);
    }

    // GET /pedidos/1
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> consultar(@PathVariable Long id) {
        return ResponseEntity.ok(service.consultar(id));
    }

    // POST /pedidos
    @PostMapping
    public ResponseEntity<Pedido> incluir(@Valid @RequestBody Pedido pedido) {
        return ResponseEntity.ok(service.incluir(pedido));
    }

    // PUT /pedidos/1
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> alterar(@PathVariable Long id,
                                          @Valid @RequestBody Pedido pedido) {
        return ResponseEntity.ok(service.alterar(id, pedido));
    }

    // DELETE /pedidos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
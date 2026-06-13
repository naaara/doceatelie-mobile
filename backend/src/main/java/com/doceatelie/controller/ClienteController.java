package com.doceatelie.controller;

import com.doceatelie.model.Cliente;
import com.doceatelie.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService service;

    // GET lista
    @GetMapping
    public List<Cliente> listar() {
        return service.listar();
    }

    // GET busca por id
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> consultar(@PathVariable Long id) {
        return ResponseEntity.ok(service.consultar(id));
    }

    // POST cadastra
    @PostMapping
    public ResponseEntity<Cliente> incluir(@Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(service.incluir(cliente));
    }

    // PUT atualiza
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> alterar(@PathVariable Long id,
                                           @Valid @RequestBody Cliente cliente) {
        return ResponseEntity.ok(service.alterar(id, cliente));
    }

    // DELETE remove
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
package com.doceatelie.controller;

import com.doceatelie.model.Produto;
import com.doceatelie.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    // GET /produtos — lista todos ordenados por categoria e nome
    @GetMapping
    public List<Produto> listar() {
        return service.listar();
    }

    // GET /produtos/disponiveis — lista só os disponíveis (útil para o app)
    @GetMapping("/disponiveis")
    public List<Produto> listarDisponiveis() {
        return service.listarDisponiveis();
    }

    // GET /produtos/1
    @GetMapping("/{id}")
    public ResponseEntity<Produto> consultar(@PathVariable Long id) {
        return ResponseEntity.ok(service.consultar(id));
    }

    // POST /produtos
    @PostMapping
    public ResponseEntity<Produto> incluir(@Valid @RequestBody Produto produto) {
        return ResponseEntity.ok(service.incluir(produto));
    }

    // PUT /produtos/1
    @PutMapping("/{id}")
    public ResponseEntity<Produto> alterar(@PathVariable Long id,
                                           @Valid @RequestBody Produto produto) {
        return ResponseEntity.ok(service.alterar(id, produto));
    }

    // DELETE /produtos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
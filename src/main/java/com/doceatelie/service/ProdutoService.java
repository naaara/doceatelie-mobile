package com.doceatelie.service;

import com.doceatelie.model.Produto;
import com.doceatelie.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public Produto incluir(Produto produto) {
        if (produto.getDisponivel() == null) produto.setDisponivel(true);
        if (produto.getDataCadastro() == null) produto.setDataCadastro(LocalDate.now());
        return repository.save(produto);
    }

    public Produto alterar(Long id, Produto produtoAtualizado) {
        Produto existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));

        existente.setNome(produtoAtualizado.getNome());
        existente.setDescricao(produtoAtualizado.getDescricao());
        existente.setPreco(produtoAtualizado.getPreco());
        existente.setDisponivel(produtoAtualizado.getDisponivel());
        existente.setCategoria(produtoAtualizado.getCategoria());
        existente.setDataCadastro(produtoAtualizado.getDataCadastro());

        return repository.save(existente);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com id: " + id);
        }
        repository.deleteById(id);
    }

    public Produto consultar(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));
    }

    public List<Produto> listar() {
        return repository.findAllByOrderByCategoriaAscNomeAsc();
    }

    public List<Produto> listarDisponiveis() {
        return repository.findByDisponivelTrue();
    }
}
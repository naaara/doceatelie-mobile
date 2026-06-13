package com.doceatelie.service;

import com.doceatelie.model.Cliente;
import com.doceatelie.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public Cliente incluir(Cliente cliente) {
        if (repository.existsByCpf(cliente.getCpf())) {
            throw new RuntimeException("Já existe um cliente com este CPF!");
        }
        if (cliente.getAtivo() == null) {
            cliente.setAtivo(true);
        }
        return repository.save(cliente);
    }

    public Cliente alterar(Long id, Cliente clienteAtualizado) {
        Cliente existente = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com id: " + id));

        existente.setNome(clienteAtualizado.getNome());
        existente.setEmail(clienteAtualizado.getEmail());
        existente.setTelefone(clienteAtualizado.getTelefone());
        existente.setDataNascimento(clienteAtualizado.getDataNascimento());
        existente.setAtivo(clienteAtualizado.getAtivo());
        existente.setCpf(clienteAtualizado.getCpf());

        return repository.save(existente);
    }

    public void excluir(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cliente não encontrado com id: " + id);
        }
        repository.deleteById(id);
    }

    public Cliente consultar(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com id: " + id));
    }

    public List<Cliente> listar() {
        return repository.findAll();
    }
}
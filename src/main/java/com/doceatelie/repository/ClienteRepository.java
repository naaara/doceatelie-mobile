package com.doceatelie.repository;

import com.doceatelie.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;//FORNECE METODOS PRONTOS (FIND ALL = LISTAR, DELETE BY ID = EXCLUIR, ...) 
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByCpf(String cpf);
}
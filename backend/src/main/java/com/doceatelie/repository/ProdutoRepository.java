package com.doceatelie.repository;

import com.doceatelie.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findAllByOrderByCategoriaAscNomeAsc();
    List<Produto> findByDisponivelTrue();
}
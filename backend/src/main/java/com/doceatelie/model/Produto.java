package com.doceatelie.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "produto")

public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto é obrigatório!")
    @Column
    (nullable = false, length = 100)
    private String nome;

    @Column
    (columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "O preço é obrigatório!")
    @Positive(message = "O preço deve ser maior que zero!")
    @Column
    (nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column
    (nullable = false)
    private Boolean disponivel = true;

    @Column
    (name = "data_cadastro")
    private LocalDate dataCadastro = LocalDate.now();

    @Column
    (length = 50)
    private String categoria;
    
    
    public Produto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public Boolean getDisponivel() { return disponivel; }
    public void setDisponivel(Boolean disponivel) { this.disponivel = disponivel; }

    public LocalDate getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDate dataCadastro) { this.dataCadastro = dataCadastro; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

}
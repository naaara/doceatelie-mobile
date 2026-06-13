package com.doceatelie.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "cliente")

public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do cliente é obrigatório!")
    @Column
    (nullable = false, length = 100)
    private String nome;

    @Column
    (length = 150)
    private String email;

    @Column
    (length = 20)
    private String telefone;

    @Column
    (name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column
    (nullable = false)
    private Boolean ativo = true;

    @NotBlank(message = "O CPF do cliente é obrigatório!")
    @Column
    (unique = true, length = 14)
    private String cpf;
    
    
    
    
    public Cliente() {}
    
    
    public Cliente(Long id, String nome, String email, String telefone, LocalDate dataNascimento, Boolean ativo, String cpf) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.ativo = ativo;
        this.cpf = cpf;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
}
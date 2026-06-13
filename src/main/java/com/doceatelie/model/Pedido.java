package com.doceatelie.model;

import jakarta.persistence.*;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    (name = "data_pedido")
    private LocalDateTime dataPedido = LocalDateTime.now();

    @Column
    (length = 50)
    private String status = "Pendente";

    @NotNull(message = "O valor total é obrigatório!")
    @Positive(message = "O valor total deve ser maior que zero!")
    
    @Column
    (name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column
    (columnDefinition = "TEXT")
    private String observacao;

    @Column
    (nullable = false)
    private Boolean entrega = false;

    @NotNull(message = "O pedido precisa estar vinculado a um cliente!")
    @ManyToOne
    @JoinColumn
    (name = "cliente_id", nullable = false)
    private Cliente cliente;
    
    
    
    
    public Pedido() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDateTime dataPedido) { this.dataPedido = dataPedido; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public Boolean getEntrega() { return entrega; }
    public void setEntrega(Boolean entrega) { this.entrega = entrega; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}
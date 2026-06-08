package br.com.sgc.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendas")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuarioResponsavel;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemVenda> itens = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal valorTotal;

    public Venda() {
    }

    public Venda(Long id, LocalDateTime data, Cliente cliente, Usuario usuarioResponsavel, List<ItemVenda> itens, BigDecimal valorTotal) {
        this.id = id;
        this.data = data;
        this.cliente = cliente;
        this.usuarioResponsavel = usuarioResponsavel;
        this.itens = itens;
        this.valorTotal = valorTotal;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getData() {
        return data;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Usuario getUsuarioResponsavel() {
        return usuarioResponsavel;
    }

    public List<ItemVenda> getItens() {
        return itens;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public void setUsuarioResponsavel(Usuario usuarioResponsavel) {
        this.usuarioResponsavel = usuarioResponsavel;
    }

    public void setItens(List<ItemVenda> itens) {
        this.itens = itens;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
}
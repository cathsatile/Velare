package br.com.sgc.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class VendaResponseDTO {

    private Long id;
    private LocalDateTime data;
    private Long clienteId;
    private String clienteNome;
    private BigDecimal valorTotal;
    private List<ItemVendaResponseDTO> itens;

    public VendaResponseDTO() {
    }

    public VendaResponseDTO(Long id, LocalDateTime data, Long clienteId, String clienteNome, BigDecimal valorTotal, List<ItemVendaResponseDTO> itens) {
        this.id = id;
        this.data = data;
        this.clienteId = clienteId;
        this.clienteNome = clienteNome;
        this.valorTotal = valorTotal;
        this.itens = itens;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getData() {
        return data;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public List<ItemVendaResponseDTO> getItens() {
        return itens;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public void setItens(List<ItemVendaResponseDTO> itens) {
        this.itens = itens;
    }
}
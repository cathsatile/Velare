package br.com.sgc.dto;

import java.math.BigDecimal;
import java.util.List;

public class RelatorioVendasDTO {

    private String inicio;
    private String fim;
    private Integer quantidadeVendas;
    private BigDecimal valorTotal;
    private List<VendaResponseDTO> vendas;

    public RelatorioVendasDTO() {
    }

    public RelatorioVendasDTO(String inicio, String fim, Integer quantidadeVendas, BigDecimal valorTotal, List<VendaResponseDTO> vendas) {
        this.inicio = inicio;
        this.fim = fim;
        this.quantidadeVendas = quantidadeVendas;
        this.valorTotal = valorTotal;
        this.vendas = vendas;
    }

    public String getInicio() {
        return inicio;
    }

    public String getFim() {
        return fim;
    }

    public Integer getQuantidadeVendas() {
        return quantidadeVendas;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public List<VendaResponseDTO> getVendas() {
        return vendas;
    }

    public void setInicio(String inicio) {
        this.inicio = inicio;
    }

    public void setFim(String fim) {
        this.fim = fim;
    }

    public void setQuantidadeVendas(Integer quantidadeVendas) {
        this.quantidadeVendas = quantidadeVendas;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public void setVendas(List<VendaResponseDTO> vendas) {
        this.vendas = vendas;
    }
}
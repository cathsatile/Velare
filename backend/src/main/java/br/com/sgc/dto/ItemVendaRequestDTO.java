package br.com.sgc.dto;

public class ItemVendaRequestDTO {

    private Long produtoId;
    private Integer quantidade;

    public ItemVendaRequestDTO() {
    }

    public ItemVendaRequestDTO(Long produtoId, Integer quantidade) {
        this.produtoId = produtoId;
        this.quantidade = quantidade;
    }

    public Long getProdutoId() {
        return produtoId;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}
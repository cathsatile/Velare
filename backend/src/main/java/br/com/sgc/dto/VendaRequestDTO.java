package br.com.sgc.dto;

import java.util.List;

public class VendaRequestDTO {

    private Long clienteId;
    private List<ItemVendaRequestDTO> itens;

    public VendaRequestDTO() {
    }

    public VendaRequestDTO(Long clienteId, List<ItemVendaRequestDTO> itens) {
        this.clienteId = clienteId;
        this.itens = itens;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public List<ItemVendaRequestDTO> getItens() {
        return itens;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public void setItens(List<ItemVendaRequestDTO> itens) {
        this.itens = itens;
    }
}
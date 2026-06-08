package br.com.sgc.controller;

import br.com.sgc.dto.RelatorioVendasDTO;
import br.com.sgc.dto.VendaRequestDTO;
import br.com.sgc.dto.VendaResponseDTO;
import br.com.sgc.service.VendaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VendaResponseDTO registrarVenda(@RequestBody VendaRequestDTO dto) {
        return vendaService.registrarVenda(dto);
    }

    @GetMapping
    public List<VendaResponseDTO> listarTodas() {
        return vendaService.listarTodas();
    }

    @GetMapping("/{id}")
    public VendaResponseDTO buscarPorId(@PathVariable Long id) {
        return vendaService.buscarPorId(id);
    }

    @GetMapping("/cliente/{clienteId}")
    public List<VendaResponseDTO> buscarPorCliente(@PathVariable Long clienteId) {
        return vendaService.buscarPorCliente(clienteId);
    }

    @GetMapping("/relatorio")
    public RelatorioVendasDTO gerarRelatorioPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim
    ) {
        return vendaService.gerarRelatorioPorPeriodo(inicio, fim);
    }
}
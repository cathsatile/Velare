package br.com.sgc.service;

import br.com.sgc.domain.model.Cliente;
import br.com.sgc.domain.model.ItemVenda;
import br.com.sgc.domain.model.Produto;
import br.com.sgc.domain.model.Venda;
import br.com.sgc.domain.repository.ClienteRepository;
import br.com.sgc.domain.repository.ProdutoRepository;
import br.com.sgc.domain.repository.VendaRepository;
import br.com.sgc.dto.ItemVendaRequestDTO;
import br.com.sgc.dto.ItemVendaResponseDTO;
import br.com.sgc.dto.RelatorioVendasDTO;
import br.com.sgc.dto.VendaRequestDTO;
import br.com.sgc.dto.VendaResponseDTO;
import br.com.sgc.exception.BusinessException;
import br.com.sgc.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public VendaService(
            VendaRepository vendaRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository
    ) {
        this.vendaRepository = vendaRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public VendaResponseDTO registrarVenda(VendaRequestDTO dto) {
        validarVendaRequest(dto);

        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

        Venda venda = new Venda();
        venda.setCliente(cliente);
        venda.setData(LocalDateTime.now());
        venda.setValorTotal(BigDecimal.ZERO);

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemVendaRequestDTO itemDto : dto.getItens()) {
            validarItemVenda(itemDto);

            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

            if (produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new BusinessException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            BigDecimal precoUnitario = produto.getPreco();
            BigDecimal subtotal = precoUnitario.multiply(BigDecimal.valueOf(itemDto.getQuantidade()));

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDto.getQuantidade());

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setVenda(venda);
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemDto.getQuantidade());
            itemVenda.setPrecoUnitario(precoUnitario);
            itemVenda.setSubtotal(subtotal);

            venda.getItens().add(itemVenda);

            valorTotal = valorTotal.add(subtotal);
        }

        venda.setValorTotal(valorTotal);

        Venda vendaSalva = vendaRepository.save(venda);

        return toResponseDTO(vendaSalva);
    }

    public List<VendaResponseDTO> listarTodas() {
        return vendaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public VendaResponseDTO buscarPorId(Long id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venda não encontrada."));

        return toResponseDTO(venda);
    }

    public List<VendaResponseDTO> buscarPorCliente(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new ResourceNotFoundException("Cliente não encontrado.");
        }

        return vendaRepository.findByClienteId(clienteId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public RelatorioVendasDTO gerarRelatorioPorPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio == null || fim == null) {
            throw new BusinessException("Data inicial e data final são obrigatórias.");
        }

        if (fim.isBefore(inicio)) {
            throw new BusinessException("A data final não pode ser anterior à data inicial.");
        }

        LocalDateTime inicioPeriodo = inicio.atStartOfDay();
        LocalDateTime fimPeriodo = fim.atTime(LocalTime.MAX);

        List<Venda> vendas = vendaRepository.findByDataBetween(inicioPeriodo, fimPeriodo);

        List<VendaResponseDTO> vendasDTO = vendas.stream()
                .map(this::toResponseDTO)
                .toList();

        BigDecimal valorTotal = vendas.stream()
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new RelatorioVendasDTO(
                inicio.toString(),
                fim.toString(),
                vendas.size(),
                valorTotal,
                vendasDTO
        );
    }

    private void validarVendaRequest(VendaRequestDTO dto) {
        if (dto == null) {
            throw new BusinessException("Dados da venda são obrigatórios.");
        }

        if (dto.getClienteId() == null) {
            throw new BusinessException("Cliente é obrigatório.");
        }

        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new BusinessException("A venda deve possuir pelo menos um item.");
        }
    }

    private void validarItemVenda(ItemVendaRequestDTO itemDto) {
        if (itemDto.getProdutoId() == null) {
            throw new BusinessException("Produto é obrigatório.");
        }

        if (itemDto.getQuantidade() == null || itemDto.getQuantidade() <= 0) {
            throw new BusinessException("A quantidade do item deve ser maior que zero.");
        }
    }

    private VendaResponseDTO toResponseDTO(Venda venda) {
        List<ItemVendaResponseDTO> itensDTO = venda.getItens()
                .stream()
                .map(item -> new ItemVendaResponseDTO(
                        item.getProduto().getId(),
                        item.getProduto().getNome(),
                        item.getQuantidade(),
                        item.getPrecoUnitario(),
                        item.getSubtotal()
                ))
                .toList();

        return new VendaResponseDTO(
                venda.getId(),
                venda.getData(),
                venda.getCliente().getId(),
                venda.getCliente().getNome(),
                venda.getValorTotal(),
                itensDTO
        );
    }
}
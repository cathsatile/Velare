package br.com.sgc.service;

import br.com.sgc.domain.model.Produto;
import br.com.sgc.domain.repository.ProdutoRepository;
import br.com.sgc.dto.ProdutoDTO;
import br.com.sgc.exception.BusinessException;
import br.com.sgc.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<ProdutoDTO> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ProdutoDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        return converterParaDTO(produto);
    }

    public ProdutoDTO criar(ProdutoDTO produtoDTO) {
        validarProduto(produtoDTO);

        Produto produto = converterParaEntidade(produtoDTO);
        Produto produtoSalvo = produtoRepository.save(produto);

        return converterParaDTO(produtoSalvo);
    }

    public ProdutoDTO atualizar(Long id, ProdutoDTO produtoDTO) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        validarProduto(produtoDTO);

        produto.setNome(produtoDTO.getNome());
        produto.setDescricao(produtoDTO.getDescricao());
        produto.setPreco(produtoDTO.getPreco());
        produto.setQuantidadeEstoque(produtoDTO.getQuantidadeEstoque());

        Produto produtoAtualizado = produtoRepository.save(produto);

        return converterParaDTO(produtoAtualizado);
    }

    public void deletar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado"));

        produtoRepository.delete(produto);
    }

    private void validarProduto(ProdutoDTO produtoDTO) {
        if (produtoDTO.getNome() == null || produtoDTO.getNome().isBlank()) {
            throw new BusinessException("Nome do produto é obrigatório");
        }

        if (produtoDTO.getPreco() == null) {
            throw new BusinessException("Preço do produto é obrigatório");
        }

        if (produtoDTO.getPreco().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Preço não pode ser negativo");
        }

        if (produtoDTO.getQuantidadeEstoque() == null) {
            throw new BusinessException("Quantidade em estoque é obrigatória");
        }

        if (produtoDTO.getQuantidadeEstoque() < 0) {
            throw new BusinessException("Quantidade em estoque não pode ser negativa");
        }
    }

    private ProdutoDTO converterParaDTO(Produto produto) {
        return new ProdutoDTO(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getQuantidadeEstoque()
        );
    }

    private Produto converterParaEntidade(ProdutoDTO produtoDTO) {
        return new Produto(
                produtoDTO.getId(),
                produtoDTO.getNome(),
                produtoDTO.getDescricao(),
                produtoDTO.getPreco(),
                produtoDTO.getQuantidadeEstoque()
        );
    }
}
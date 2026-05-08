package br.com.sgc.service;

import br.com.sgc.domain.model.Produto;
import br.com.sgc.domain.repository.ProdutoRepository;
import br.com.sgc.dto.ProdutoDTO;
import br.com.sgc.exception.BusinessException;
import br.com.sgc.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    @Test
    void deveCriarProdutoDeJoalheriaComSucesso() {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setNome("Anel de Ouro 18k");
        dto.setDescricao("Anel em ouro 18k com acabamento polido");
        dto.setPreco(new BigDecimal("1299.90"));
        dto.setQuantidadeEstoque(5);

        Produto produtoSalvo = new Produto();
        produtoSalvo.setId(1L);
        produtoSalvo.setNome("Anel de Ouro 18k");
        produtoSalvo.setDescricao("Anel em ouro 18k com acabamento polido");
        produtoSalvo.setPreco(new BigDecimal("1299.90"));
        produtoSalvo.setQuantidadeEstoque(5);

        when(produtoRepository.save(any(Produto.class))).thenReturn(produtoSalvo);

        ProdutoDTO resultado = produtoService.criar(dto);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Anel de Ouro 18k", resultado.getNome());
        assertEquals("Anel em ouro 18k com acabamento polido", resultado.getDescricao());
        assertEquals(new BigDecimal("1299.90"), resultado.getPreco());
        assertEquals(5, resultado.getQuantidadeEstoque());

        verify(produtoRepository).save(any(Produto.class));
    }

    @Test
    void deveBuscarProdutoDeJoalheriaPorIdComSucesso() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Colar de Prata 925");
        produto.setDescricao("Colar de prata 925 com pingente delicado");
        produto.setPreco(new BigDecimal("349.90"));
        produto.setQuantidadeEstoque(12);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        ProdutoDTO resultado = produtoService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Colar de Prata 925", resultado.getNome());
        assertEquals("Colar de prata 925 com pingente delicado", resultado.getDescricao());
        assertEquals(new BigDecimal("349.90"), resultado.getPreco());
        assertEquals(12, resultado.getQuantidadeEstoque());

        verify(produtoRepository).findById(1L);
    }

    @Test
    void deveLancarErroQuandoProdutoNaoExiste() {
        when(produtoRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> produtoService.buscarPorId(99L)
        );

        assertEquals("Produto não encontrado", exception.getMessage());

        verify(produtoRepository).findById(99L);
    }

    @Test
    void deveLancarErroQuandoPrecoForNegativo() {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setNome("Pulseira de Pérolas");
        dto.setDescricao("Pulseira com pérolas naturais");
        dto.setPreco(new BigDecimal("-50.00"));
        dto.setQuantidadeEstoque(3);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> produtoService.criar(dto)
        );

        assertEquals("Preço não pode ser negativo", exception.getMessage());

        verifyNoInteractions(produtoRepository);
    }

    @Test
    void deveLancarErroQuandoQuantidadeEstoqueForNula() {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setNome("Brinco de Diamante");
        dto.setDescricao("Brinco pequeno com pedra brilhante");
        dto.setPreco(new BigDecimal("899.90"));
        dto.setQuantidadeEstoque(null);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> produtoService.criar(dto)
        );

        assertEquals("Quantidade em estoque é obrigatória", exception.getMessage());

        verifyNoInteractions(produtoRepository);
    }

    @Test
    void deveLancarErroQuandoQuantidadeEstoqueForNegativa() {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setNome("Aliança de Prata");
        dto.setDescricao("Aliança de prata lisa");
        dto.setPreco(new BigDecimal("199.90"));
        dto.setQuantidadeEstoque(-2);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> produtoService.criar(dto)
        );

        assertEquals("Quantidade em estoque não pode ser negativa", exception.getMessage());

        verifyNoInteractions(produtoRepository);
    }
}
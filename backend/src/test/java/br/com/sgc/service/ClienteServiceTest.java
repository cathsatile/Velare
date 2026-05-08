package br.com.sgc.service;

import br.com.sgc.domain.model.Cliente;
import br.com.sgc.domain.repository.ClienteRepository;
import br.com.sgc.dto.ClienteDTO;
import br.com.sgc.exception.BusinessException;
import br.com.sgc.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @Test
    void deveCriarClienteComSucesso() {
        ClienteDTO dto = new ClienteDTO();
        dto.setNome("Maria Oliveira");
        dto.setCpf("12345678900");
        dto.setEmail("maria@email.com");
        dto.setTelefone("11999999999");

        Cliente clienteSalvo = new Cliente();
        clienteSalvo.setId(1L);
        clienteSalvo.setNome("Maria Oliveira");
        clienteSalvo.setCpf("12345678900");
        clienteSalvo.setEmail("maria@email.com");
        clienteSalvo.setTelefone("11999999999");

        when(clienteRepository.existsByCpf("12345678900")).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenReturn(clienteSalvo);

        ClienteDTO resultado = clienteService.criar(dto);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Maria Oliveira", resultado.getNome());
        assertEquals("12345678900", resultado.getCpf());
        assertEquals("maria@email.com", resultado.getEmail());
        assertEquals("11999999999", resultado.getTelefone());

        verify(clienteRepository).existsByCpf("12345678900");
        verify(clienteRepository).save(any(Cliente.class));
    }

    @Test
    void deveBuscarClientePorIdComSucesso() {
        Cliente cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNome("Ana Souza");
        cliente.setCpf("98765432100");
        cliente.setEmail("ana@email.com");
        cliente.setTelefone("11888888888");

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        ClienteDTO resultado = clienteService.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Ana Souza", resultado.getNome());
        assertEquals("98765432100", resultado.getCpf());
        assertEquals("ana@email.com", resultado.getEmail());
        assertEquals("11888888888", resultado.getTelefone());

        verify(clienteRepository).findById(1L);
    }

    @Test
    void deveLancarErroQuandoClienteNaoExiste() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> clienteService.buscarPorId(99L)
        );

        assertEquals("Cliente não encontrado", exception.getMessage());

        verify(clienteRepository).findById(99L);
    }

    @Test
    void deveLancarErroQuandoCpfJaExiste() {
        ClienteDTO dto = new ClienteDTO();
        dto.setNome("Maria Oliveira");
        dto.setCpf("12345678900");
        dto.setEmail("maria@email.com");
        dto.setTelefone("11999999999");

        when(clienteRepository.existsByCpf("12345678900")).thenReturn(true);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> clienteService.criar(dto)
        );

        assertEquals("CPF já cadastrado", exception.getMessage());

        verify(clienteRepository).existsByCpf("12345678900");
        verify(clienteRepository, never()).save(any(Cliente.class));
    }

    @Test
    void deveLancarErroQuandoEmailForInvalido() {
        ClienteDTO dto = new ClienteDTO();
        dto.setNome("Carla Mendes");
        dto.setCpf("11122233344");
        dto.setEmail("email-invalido");
        dto.setTelefone("11777777777");

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> clienteService.criar(dto)
        );

        assertEquals("Email inválido", exception.getMessage());

        verifyNoInteractions(clienteRepository);
    }
}
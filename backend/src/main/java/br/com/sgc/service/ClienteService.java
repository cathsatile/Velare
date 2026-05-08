package br.com.sgc.service;

import br.com.sgc.domain.model.Cliente;
import br.com.sgc.domain.repository.ClienteRepository;
import br.com.sgc.dto.ClienteDTO;
import br.com.sgc.exception.BusinessException;
import br.com.sgc.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<ClienteDTO> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ClienteDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        return converterParaDTO(cliente);
    }

    public ClienteDTO criar(ClienteDTO clienteDTO) {
        validarClienteParaCriacao(clienteDTO);

        Cliente cliente = converterParaEntidade(clienteDTO);
        Cliente clienteSalvo = clienteRepository.save(cliente);

        return converterParaDTO(clienteSalvo);
    }

    public ClienteDTO atualizar(Long id, ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        validarClienteParaAtualizacao(id, clienteDTO);

        cliente.setNome(clienteDTO.getNome());
        cliente.setCpf(clienteDTO.getCpf());
        cliente.setTelefone(clienteDTO.getTelefone());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setEndereco(clienteDTO.getEndereco());

        Cliente clienteAtualizado = clienteRepository.save(cliente);

        return converterParaDTO(clienteAtualizado);
    }

    public void deletar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        clienteRepository.delete(cliente);
    }

    private void validarClienteParaCriacao(ClienteDTO clienteDTO) {
        if (clienteDTO.getNome() == null || clienteDTO.getNome().isBlank()) {
            throw new BusinessException("Nome do cliente é obrigatório");
        }

        if (clienteDTO.getCpf() == null || clienteDTO.getCpf().isBlank()) {
            throw new BusinessException("CPF do cliente é obrigatório");
        }

        if (clienteDTO.getEmail() == null || clienteDTO.getEmail().isBlank()) {
            throw new BusinessException("Email do cliente é obrigatório");
        }

        if (!clienteDTO.getEmail().contains("@")) {
            throw new BusinessException("Email inválido");
        }

        if (clienteRepository.existsByCpf(clienteDTO.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }
    }

    private void validarClienteParaAtualizacao(Long id, ClienteDTO clienteDTO) {
        if (clienteDTO.getNome() == null || clienteDTO.getNome().isBlank()) {
            throw new BusinessException("Nome do cliente é obrigatório");
        }

        if (clienteDTO.getCpf() == null || clienteDTO.getCpf().isBlank()) {
            throw new BusinessException("CPF do cliente é obrigatório");
        }

        if (clienteDTO.getEmail() == null || clienteDTO.getEmail().isBlank()) {
            throw new BusinessException("Email do cliente é obrigatório");
        }

        if (!clienteDTO.getEmail().contains("@")) {
            throw new BusinessException("Email inválido");
        }

        if (clienteRepository.existsByCpfAndIdNot(clienteDTO.getCpf(), id)) {
            throw new BusinessException("CPF já cadastrado para outro cliente");
        }
    }

    private ClienteDTO converterParaDTO(Cliente cliente) {
        return new ClienteDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getTelefone(),
                cliente.getEmail(),
                cliente.getEndereco()
        );
    }

    private Cliente converterParaEntidade(ClienteDTO clienteDTO) {
        return new Cliente(
                clienteDTO.getId(),
                clienteDTO.getNome(),
                clienteDTO.getCpf(),
                clienteDTO.getTelefone(),
                clienteDTO.getEmail(),
                clienteDTO.getEndereco()
        );
    }
}
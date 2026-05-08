package br.com.sgc.service;

import br.com.sgc.config.JwtService;
import br.com.sgc.domain.enums.PerfilUsuario;
import br.com.sgc.domain.model.Usuario;
import br.com.sgc.domain.repository.UsuarioRepository;
import br.com.sgc.dto.AuthRequestDTO;
import br.com.sgc.dto.AuthResponseDTO;
import br.com.sgc.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveFazerLoginComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Administrador");
        usuario.setEmail("admin@email.com");
        usuario.setSenha("senha-criptografada");
        usuario.setPerfil(PerfilUsuario.ADMIN);

        AuthRequestDTO request = new AuthRequestDTO();
        request.setEmail("admin@email.com");
        request.setSenha("123456");

        when(usuarioRepository.findByEmail("admin@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("123456", "senha-criptografada")).thenReturn(true);
        when(jwtService.gerarToken(usuario)).thenReturn("token-jwt-falso-para-teste");

        AuthResponseDTO response = authService.login(request);

        assertNotNull(response);
        assertEquals("token-jwt-falso-para-teste", response.getToken());

        verify(usuarioRepository).findByEmail("admin@email.com");
        verify(passwordEncoder).matches("123456", "senha-criptografada");
        verify(jwtService).gerarToken(usuario);
    }

    @Test
    void deveLancarErroQuandoEmailNaoExiste() {
        AuthRequestDTO request = new AuthRequestDTO();
        request.setEmail("naoexiste@email.com");
        request.setSenha("123456");

        when(usuarioRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> authService.login(request)
        );

        assertEquals("Email ou senha inválidos", exception.getMessage());

        verify(usuarioRepository).findByEmail("naoexiste@email.com");
        verifyNoInteractions(passwordEncoder);
        verifyNoInteractions(jwtService);
    }

    @Test
    void deveLancarErroQuandoSenhaEstaErrada() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Administrador");
        usuario.setEmail("admin@email.com");
        usuario.setSenha("senha-criptografada");
        usuario.setPerfil(PerfilUsuario.ADMIN);

        AuthRequestDTO request = new AuthRequestDTO();
        request.setEmail("admin@email.com");
        request.setSenha("senha-errada");

        when(usuarioRepository.findByEmail("admin@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-errada", "senha-criptografada")).thenReturn(false);

        BusinessException exception = assertThrows(
                BusinessException.class,
                () -> authService.login(request)
        );

        assertEquals("Email ou senha inválidos", exception.getMessage());

        verify(usuarioRepository).findByEmail("admin@email.com");
        verify(passwordEncoder).matches("senha-errada", "senha-criptografada");
        verifyNoInteractions(jwtService);
    }
}
package br.com.sgc.service;

import br.com.sgc.config.JwtService;
import br.com.sgc.domain.model.Usuario;
import br.com.sgc.domain.repository.UsuarioRepository;
import br.com.sgc.dto.AuthRequestDTO;
import br.com.sgc.dto.AuthResponseDTO;
import br.com.sgc.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO login(AuthRequestDTO authRequest) {
        Usuario usuario = usuarioRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new BusinessException("Email ou senha inválidos"));

        boolean senhaCorreta = passwordEncoder.matches(
                authRequest.getSenha(),
                usuario.getSenha()
        );

        if (!senhaCorreta) {
            throw new BusinessException("Email ou senha inválidos");
        }

        String token = jwtService.gerarToken(usuario);

        return new AuthResponseDTO(token);
    }
}
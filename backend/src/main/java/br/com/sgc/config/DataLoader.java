package br.com.sgc.config;

import br.com.sgc.domain.enums.PerfilUsuario;
import br.com.sgc.domain.model.Usuario;
import br.com.sgc.domain.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail("admin@email.com").isEmpty()) {
            Usuario admin = new Usuario();

            admin.setNome("Administrador");
            admin.setEmail("admin@email.com");
            admin.setSenha(passwordEncoder.encode("123456"));
            admin.setPerfil(PerfilUsuario.ADMIN);

            usuarioRepository.save(admin);
        }
    }
}
package br.com.sgc.domain.repository;

import br.com.sgc.domain.model.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

    Optional<Usuario> findByemail(String email);
    
}

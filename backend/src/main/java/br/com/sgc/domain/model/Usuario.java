package br.com.sgc.domain.model;

import br.com.sgc.domain.enums.PerfilUsuario;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")

public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    private String senha;

    @Enumerated(EnumType.STRING)
    private PerfilUsuario perfil;

    public Usuario() {
    }

    public Usuario(Long id, String nome, String email, String senha, PerfilUsuario perfil) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }
    
    public String getEmail() {
        return email;
    }

    public String getSenha() {
        return senha;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPerfil(PerfilUsuario perfil) {
        this.perfil = perfil;
    } 
}

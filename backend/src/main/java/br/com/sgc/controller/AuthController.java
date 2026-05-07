package br.com.sgc.controller;

import br.com.sgc.dto.AuthRequestDTO;
import br.com.sgc.dto.AuthResponseDTO;
import br.com.sgc.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO authRequest) {
        AuthResponseDTO response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }
}
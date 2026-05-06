package br.com.sgc.dto;

public class AuthResponseDTO {

    private String token;

    public AuthResponseDTO() {
    }

    public void AuthResposeDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

package br.com.sgc.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> tratarResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        ErrorResponse erro = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                exception.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> tratarBusinessException(
            BusinessException exception,
            HttpServletRequest request
    ) {
        ErrorResponse erro = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                exception.getMessage(),
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> tratarResponseStatusException(
            ResponseStatusException exception,
            HttpServletRequest request
    ) {
        int statusCode = exception.getStatusCode().value();
        HttpStatus status = HttpStatus.resolve(statusCode);

        String mensagem = exception.getReason() != null
                ? exception.getReason()
                : "Não foi possível concluir a operação.";

        ErrorResponse erro = new ErrorResponse(
                LocalDateTime.now(),
                statusCode,
                status != null ? status.getReasonPhrase() : "Erro",
                mensagem,
                request.getRequestURI()
        );

        return ResponseEntity.status(exception.getStatusCode()).body(erro);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> tratarDataIntegrityViolationException(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        String mensagem = mensagemDeIntegridade(request);

        ErrorResponse erro = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                "Conflict",
                mensagem,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> tratarErroDeValidacao(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        String mensagem = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(erro -> erro.getDefaultMessage())
                .orElse("Dados inválidos");

        ErrorResponse erro = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                mensagem,
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> tratarException(
            Exception exception,
            HttpServletRequest request
    ) {
        if (ehExclusaoDeProduto(request)) {
            ErrorResponse erro = new ErrorResponse(
                    LocalDateTime.now(),
                    HttpStatus.CONFLICT.value(),
                    "Conflict",
                    "Produto com vendas registradas não pode ser excluído.",
                    request.getRequestURI()
            );

            return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
        }

        ErrorResponse erro = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Não foi possível concluir a operação.",
                request.getRequestURI()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
    }

    private String mensagemDeIntegridade(HttpServletRequest request) {
        if (ehExclusaoDeProduto(request)) {
            return "Produto com vendas registradas não pode ser excluído.";
        }

        if (ehExclusaoDeCliente(request)) {
            return "Cliente com vendas registradas não pode ser excluído.";
        }

        return "Este registro está vinculado a outras informações do sistema e não pode ser excluído.";
    }

    private boolean ehExclusaoDeProduto(HttpServletRequest request) {
        return "DELETE".equalsIgnoreCase(request.getMethod())
                && request.getRequestURI().contains("/produtos");
    }

    private boolean ehExclusaoDeCliente(HttpServletRequest request) {
        return "DELETE".equalsIgnoreCase(request.getMethod())
                && request.getRequestURI().contains("/clientes");
    }
}
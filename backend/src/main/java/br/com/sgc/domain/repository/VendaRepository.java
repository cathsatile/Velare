package br.com.sgc.domain.repository;

import br.com.sgc.domain.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByClienteId(Long clienteId);

    List<Venda> findByDataBetween(LocalDateTime inicio, LocalDateTime fim);
}
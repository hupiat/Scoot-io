package hupiat.scootio.server.core.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.entities.AbstractCommonEntity;

public interface ICommonController<E extends AbstractCommonEntity> {

	static final String API_PREFIX = "api";
	
	@GetMapping
	List<E> getAll();
	
	@GetMapping("/{id}")
	E getById(int id);
	
	@PostMapping
	E add(E entity);
	
	@PutMapping
	E update(E entity);	
	
	@DeleteMapping("/{id}")
	void delete(int id);
}

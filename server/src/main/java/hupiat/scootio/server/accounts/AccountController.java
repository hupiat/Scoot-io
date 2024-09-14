package hupiat.scootio.server.accounts;

import java.util.List;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.controllers.ICommonController;

@RestController(ICommonController.API_PREFIX + "/accounts")
public class AccountController implements ICommonController<AccountEntity> {
	
	private final AccountService service;
	private final AccountRepository repository;

	public AccountController(AccountService service, AccountRepository repository) {
		super();
		this.service = service;
		this.repository = repository;
	}

	@Override
	public List<AccountEntity> getAll() {
		return repository.findAll();
	}

	@Override
	public AccountEntity getById(@PathVariable int id) {
		return repository.findById(id).orElseThrow();
	}
	
	@PostMapping
	public AccountEntity login(AccountLoginDTO dto) throws AuthenticationException {
		return service.login(dto.email(), dto.password());
	}

	@Override
	public AccountEntity add(@RequestBody AccountEntity entity) {
		return service.insert(entity.getUsername(), entity.getEmail(), entity.getPassword());
	}

	@Override
	public AccountEntity update(@RequestBody AccountEntity entity) {
		return service.update(entity);
	}

	@Override
	public void delete(int id) {
		repository.deleteById(id);
	}
}

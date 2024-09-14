package hupiat.scootio.server.accounts;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

	private final BCryptPasswordEncoder encoder;
	private final AccountRepository repository;
	
	public AccountService(BCryptPasswordEncoder encoder, AccountRepository repository) {
		super();
		this.encoder = encoder;
		this.repository = repository;
	}
	
	public AccountEntity login(String email, String password) throws AuthenticationException {
		AccountEntity entity = repository.findByEmail(email).orElseThrow();
		if (!encoder.matches(password, entity.getPassword())) {
			throw new AuthenticationException("Bad password");
		}
		return entity;
	}

	public AccountEntity insert(String username, String email, String password) {
		AccountEntity entity = new AccountEntity(email, username, encoder.encode(password));
		return repository.save(entity);
	}
	
	public AccountEntity insert(String username, String email, String password, byte[] picture) {
		AccountEntity entity = insert(username, email, password);
		entity.setPicture(picture);
		return repository.save(entity);
	}
	
	public AccountEntity update(AccountEntity newEntity) {
		newEntity.setPassword(encoder.encode(newEntity.getPassword()));
		return repository.save(newEntity);
	}
}

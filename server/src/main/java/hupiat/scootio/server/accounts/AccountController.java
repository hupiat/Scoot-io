package hupiat.scootio.server.accounts;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.controllers.ICommonController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController(ICommonController.API_PREFIX + "/accounts")
public class AccountController implements ICommonController<AccountEntity> {
	
	private final AccountService service;
	private final AccountRepository repository;
	private final AccountAuthProvider accountAuthProvider;

	public AccountController(UserDetailsService service, AccountRepository repository,
			AccountAuthProvider accountAuthProvider) {
		super();
		this.service = (AccountService) service;
		this.repository = repository;
		this.accountAuthProvider = accountAuthProvider;
	}

	@Override
	public List<AccountEntity> getAll() {
		return repository.findAll();
	}

	@Override
	public AccountEntity getById(@PathVariable int id) {
		return repository.findById(id).orElseThrow();
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

	@PostMapping("login")
	AccountEntity login(@RequestBody AccountLoginDTO token, HttpServletRequest req) {
		AccountEntity account = repository.findByEmail(token.email()).orElseThrow();
		Authentication auth = accountAuthProvider
				.authenticate(new UsernamePasswordAuthenticationToken(account.getUsername(), token.password(), new ArrayList<>()));
		SecurityContext sc = SecurityContextHolder.getContext();
		sc.setAuthentication(auth);
		HttpSession session = req.getSession(true);
		session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
		account.setPassword(null);
		return account;
	}

	@DeleteMapping("logout")
	AccountEntity logout(HttpSession session) {
		SecurityContext context = SecurityContextHolder.getContext();
		Authentication token = context.getAuthentication();
		AccountEntity account = repository.findByUsername(token.getName()).orElseThrow();
		session.removeAttribute(SPRING_SECURITY_CONTEXT_KEY);
		account.setPassword(null);
		return account;
	}
}

package hupiat.scootio.server.accounts;

import java.util.ArrayList;
import java.util.List;

import javax.mail.MessagingException;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.controllers.ICommonController;
import hupiat.scootio.server.core.mailing.EmailSender;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RequestMapping(ICommonController.API_PREFIX + "/accounts")
@RestController
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
	public AccountEntity getById(@PathVariable long id) {
		return repository.findById(id).orElseThrow();
	}

	@Override
	public AccountEntity add(@RequestBody AccountEntity entity) {
		AccountEntity account = null;
		try {
			account = service.insert(entity.getUsername(), entity.getEmail(), entity.getPassword());
		} catch (MessagingException e) {
			throw new InternalError(e);
		}
		return account;
	}

	@Override
	public AccountEntity update(@RequestBody AccountEntity entity) {
		return service.update(entity, true);
	}

	@Override
	public void delete(@PathVariable long id) {
		repository.deleteById(id);
	}
	
	@PostMapping("retrieve_password/{mail}")
	public void sendNewPassword(@PathVariable String mail) {
		AccountEntity account = repository.findByEmail(mail).orElseThrow();
		String newPassword = AccountService.generateNewPasswordForRetrieving(AccountService.NEW_PASSWORD_RETRIEVAL_LENGTH);
		account.setPassword(newPassword);
		account = service.update(account, true);
		try {
			EmailSender.sendNewPasswordRetrieving(mail, newPassword);
		} catch (MessagingException e) {
			throw new InternalError(e);
		}
	}
	
	@PostMapping("login_from_token")
	public AccountEntity loginFromToken(@RequestBody String token, HttpServletRequest req) {
		AccountEntity account = repository.findByToken(token).orElseThrow();
		return login(account, req, token);
	}

	@PostMapping("login")
	public AccountEntity login(@RequestBody AccountLoginDTO token, HttpServletRequest req) {
		AccountEntity account = repository.findByEmail(token.email()).orElseThrow();
		return login(account, req, token.password());
	}

	@DeleteMapping("logout")
	public AccountEntity logout(HttpSession session) {
		SecurityContext context = SecurityContextHolder.getContext();
		Authentication token = context.getAuthentication();
		AccountEntity account = repository.findByEmail(token.getName()).orElseThrow();
		session.removeAttribute(SPRING_SECURITY_CONTEXT_KEY);
		account.setPassword(null);
		return account;
	}
	
	private AccountEntity login(AccountEntity account, HttpServletRequest req, String passOrToken) {
		Authentication auth = accountAuthProvider
				.authenticate(new UsernamePasswordAuthenticationToken(account.getEmail(), passOrToken, new ArrayList<>()));
		SecurityContext sc = SecurityContextHolder.getContext();
		sc.setAuthentication(auth);
		HttpSession session = req.getSession(true);
		session.setAttribute(SPRING_SECURITY_CONTEXT_KEY, sc);
		account.setPassword(null);
		return account;
	}
}

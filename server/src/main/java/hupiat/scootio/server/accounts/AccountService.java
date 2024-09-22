package hupiat.scootio.server.accounts;

import java.security.SecureRandom;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import hupiat.scootio.server.core.mailing.EmailSender;

// Instantiated by SecurityConfigAdapter to avoid circular dependencies for password encoder
// Still a bean at all

public class AccountService implements UserDetailsService {

	private final BCryptPasswordEncoder encoder;
	private final AccountRepository repository;
	
	public AccountService(BCryptPasswordEncoder encoder, AccountRepository repository) {
		super();
		this.encoder = encoder;
		this.repository = repository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return repository.findByEmail(username).orElseThrow();
	}

	public AccountEntity insert(String username, String email, String password) throws AddressException, MessagingException {
		AccountEntity entity = new AccountEntity(email, username, encoder.encode(password), AccountService.generateToken());
		entity = repository.save(entity);
		EmailSender.sendConfirmationSuscribe(email);
		return entity;
	}
	
	public AccountEntity insert(String username, String email, String password, byte[] picture) throws AddressException, MessagingException {
		AccountEntity entity = insert(username, email, password);
		entity.setPicture(picture);
		return repository.save(entity);
	}
	
	public AccountEntity update(AccountEntity newEntity, boolean shouldEncode) {
		if (shouldEncode) {
			newEntity.setPassword(encoder.encode(newEntity.getPassword()));
		}
		return repository.save(newEntity);
	}
	
	public static String generateToken() {
		return UUID.randomUUID().toString();
	}

	public static final int NEW_PASSWORD_RETRIEVAL_LENGTH = 10;
	public static String generateNewPasswordForRetrieving(int length) {
        if (length < 1) {
        	throw new IllegalArgumentException("length should be 1 or more");
        }
        final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String LOWER = "abcdefghijklmnopqrstuvwxyz";
        final String DIGITS = "0123456789";
        final String SPECIAL = "!@#$%&*()-_=+<>?";
        final String ALL_CHARACTERS = UPPER + LOWER + DIGITS + SPECIAL;
        
        SecureRandom rand = new SecureRandom();

        StringBuilder password = new StringBuilder(length);

        password.append(UPPER.charAt(rand.nextInt(UPPER.length())));
        password.append(LOWER.charAt(rand.nextInt(LOWER.length())));
        password.append(DIGITS.charAt(rand.nextInt(DIGITS.length())));
        password.append(SPECIAL.charAt(rand.nextInt(SPECIAL.length())));

        for (int i = 4; i < length; i++) {
            password.append(ALL_CHARACTERS.charAt(rand.nextInt(ALL_CHARACTERS.length())));
        }

        return password.toString();
	}
}

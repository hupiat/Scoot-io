package hupiat.scootio.server.accounts;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import hupiat.scootio.server.core.entities.AbstractCommonEntity;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "accounts")
public class AccountEntity extends AbstractCommonEntity implements UserDetails {

	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(nullable = false, unique = true)
	private String username;
	
	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false)
	private String token;
	
	@Lob
	@Nullable
	private byte[] picture;

	public AccountEntity() {
		super();
	}

	public AccountEntity(String email, String username, String password, String token) {
		super();
		this.email = email;
		this.username = username;
		this.password = password;
		this.token = token;
	}

	public AccountEntity(String email, String username, String password, String token, byte[] picture) {
		super();
		this.email = email;
		this.username = username;
		this.password = password;
		this.token = token;
		this.picture = picture;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public byte[] getPicture() {
		return picture;
	}

	public void setPicture(byte[] picture) {
		this.picture = picture;
	}

	@Override
	public String toString() {
		return "AccountEntity [email=" + email + ", username=" + username + "]";
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO : not implemented yet
		return null;
	}
}

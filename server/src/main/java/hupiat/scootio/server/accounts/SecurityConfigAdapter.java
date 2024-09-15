package hupiat.scootio.server.accounts;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import hupiat.scootio.server.core.controllers.ICommonController;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfigAdapter {

	private final AccountRepository accountRepository;

	public SecurityConfigAdapter(AccountRepository accountRepository) {
		super();
		this.accountRepository = accountRepository;
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests()
				.requestMatchers(HttpMethod.POST, ICommonController.API_PREFIX + "/accounts" + "/login", ICommonController.API_PREFIX + "/accounts")
				.permitAll().anyRequest().authenticated().and()
				.logout(logout -> logout.logoutUrl(ICommonController.API_PREFIX + "/accounts" + "/logout"))
				.formLogin(AbstractHttpConfigurer::disable).cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
					@Override
					public void customize(CorsConfigurer<HttpSecurity> configurer) {
						configurer.configurationSource(new CorsConfigurationSource() {
							@Override
							public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
								var config = new CorsConfiguration();
								config.setAllowedMethods(List.of(HttpMethod.GET.toString(), HttpMethod.POST.toString(),
										HttpMethod.PUT.toString(), HttpMethod.DELETE.toString()));
								config.setAllowCredentials(true);
								config.setAllowedOriginPatterns(List.of("127.0.0.1", "localhost", "192.168.*"));
								config.applyPermitDefaultValues();
								config.validateAllowCredentials();
								return config;
							}
						});
						configurer.configure(http);
					}
				});

		return http.csrf(csrf -> csrf.disable()).build();
	}

	@Bean
	BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	UserDetailsService userDetailsService() {
		return new AccountService(bCryptPasswordEncoder(), accountRepository);
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		return new AccountAuthProvider(userDetailsService(), bCryptPasswordEncoder());
	}
}

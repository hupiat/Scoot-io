package hupiat.scootio.server.accounts;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Integer> {

	Optional<AccountEntity> findByEmail(String email);
	
	Optional<AccountEntity> findByUsername(String username);
}

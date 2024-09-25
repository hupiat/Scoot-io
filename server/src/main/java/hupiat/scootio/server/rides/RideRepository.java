package hupiat.scootio.server.rides;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideRepository extends JpaRepository<RideEntity, Long> {

	void deleteAllById(Set<Long> ids);
}

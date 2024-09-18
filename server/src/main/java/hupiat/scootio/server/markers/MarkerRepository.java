package hupiat.scootio.server.markers;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface MarkerRepository extends JpaRepository<MarkerEntity, Long> {

}

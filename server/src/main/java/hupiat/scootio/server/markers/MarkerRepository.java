package hupiat.scootio.server.markers;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface MarkerRepository extends JpaRepository<MarkerEntity, Long> {

	List<MarkerEntity> findAllByGeometry(GeocodeEntity geometry);
}

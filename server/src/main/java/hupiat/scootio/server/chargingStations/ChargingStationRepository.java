package hupiat.scootio.server.chargingStations;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hupiat.scootio.server.markers.GeocodeEntity;

@Repository
public interface ChargingStationRepository extends JpaRepository<ChargingStationEntity, Long> {

	Optional<ChargingStationEntity> findByGeometry(GeocodeEntity geometry);
}
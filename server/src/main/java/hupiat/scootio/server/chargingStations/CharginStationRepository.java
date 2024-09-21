package hupiat.scootio.server.chargingStations;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hupiat.scootio.server.markers.GeocodeEntity;

@Repository
public interface CharginStationRepository extends JpaRepository<ChargingStationEntity, Long> {

	List<ChargingStationEntity> findAllByGeometry(GeocodeEntity geometry);
}
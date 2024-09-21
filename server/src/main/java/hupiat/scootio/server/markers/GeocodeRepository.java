package hupiat.scootio.server.markers;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GeocodeRepository extends JpaRepository<GeocodeEntity, Long> {

	@Query(value = 
		    "SELECT * FROM geocodes WHERE ST_DWithin("
		    + "ST_Transform(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326), 3857), "
		    + "ST_Transform(ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), 3857), :radius) = true", 
		    nativeQuery = true)
    List<GeocodeEntity> findGeocodesAroundPosition(
        @Param("longitude") double longitude, 
        @Param("latitude") double latitude, 
        @Param("radius") double radius
    );
}

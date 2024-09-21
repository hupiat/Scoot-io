package hupiat.scootio.server.markers;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GeocodeRepository extends JpaRepository<GeocodeEntity, Long> {

    @Query(value = 
    		"SELECT g FROM GeocodeEntity g WHERE ST_DWithin(ST_SetSRID(ST_MakePoint(g.longitude, g.latitude), 4326), "
    		+ "ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326), :radius) = true", nativeQuery = true)
    List<GeocodeEntity> findGeocodesAroundPosition(
        @Param("longitude") float longitude, 
        @Param("latitude") float latitude, 
        @Param("radius") float radius
    );
}

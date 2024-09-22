package hupiat.scootio.server.markers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class MarkerService {

	private static final int LOCAL_SEARCH_RADIUS_METERS = 25000;
	
	private final GeocodeRepository geocodeRepository;
	private final MarkerRepository markerRepository;
	
	public MarkerService(GeocodeRepository geocodeRepository, MarkerRepository markerRepository) {
		super();
		this.geocodeRepository = geocodeRepository;
		this.markerRepository = markerRepository;
	}

	@Transactional
	public List<MarkerEntity> fetchAllMarkersByRadius(double longitude, double latitude) {
		List<MarkerEntity> res = new ArrayList<>();
		List<GeocodeEntity> geometries = geocodeRepository
				.findGeocodesAroundPosition(longitude, latitude, LOCAL_SEARCH_RADIUS_METERS);
		for (GeocodeEntity geocode : geometries) {
			markerRepository.findByGeometry(geocode).ifPresent(res::add);
		}
		return res;
	}
}

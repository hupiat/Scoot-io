package hupiat.scootio.server.markers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import hupiat.scootio.server.chargingStations.ChargingStationRepository;
import hupiat.scootio.server.chargingStations.ChargingStationEntity;
import jakarta.transaction.Transactional;

@Service
public class MarkerService {

	private static final int LOCAL_SEARCH_RADIUS_METERS = 25000;
	
	private final GeocodeRepository geocodeRepository;
	private final MarkerRepository markerRepository;
	private final ChargingStationRepository chargingStationRepository;
	
	public MarkerService(GeocodeRepository geocodeRepository, MarkerRepository markerRepository,
			ChargingStationRepository charginStationRepository) {
		super();
		this.geocodeRepository = geocodeRepository;
		this.markerRepository = markerRepository;
		this.chargingStationRepository = charginStationRepository;
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
	
	@Transactional
	public List<ChargingStationEntity> fetchAllChargingStationsByRadius(double longitude, double latitude) {
		List<ChargingStationEntity> res = new ArrayList<>();
		List<GeocodeEntity> geometries = geocodeRepository
				.findGeocodesAroundPosition(longitude, latitude, LOCAL_SEARCH_RADIUS_METERS);
		for (GeocodeEntity geocode : geometries) {
			chargingStationRepository.findByGeometry(geocode).ifPresent(res::add);
		}
		return res;
	}
}

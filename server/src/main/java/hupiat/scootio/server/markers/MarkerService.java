package hupiat.scootio.server.markers;

import java.util.List;

import org.springframework.stereotype.Service;

import hupiat.scootio.server.chargingStations.CharginStationRepository;
import hupiat.scootio.server.chargingStations.ChargingStationEntity;

@Service
public class MarkerService {

	private static final int LOCAL_SEARCH_RADIUS_METERS = 10000;
	
	private final GeocodeRepository geocodeRepository;
	private final MarkerRepository markerRepository;
	private final CharginStationRepository charginStationRepository;
	
	public MarkerService(GeocodeRepository geocodeRepository, MarkerRepository markerRepository,
			CharginStationRepository charginStationRepository) {
		super();
		this.geocodeRepository = geocodeRepository;
		this.markerRepository = markerRepository;
		this.charginStationRepository = charginStationRepository;
	}

	public List<MarkerEntity> fetchAllMarkersByRadius(float longitude, float latitude) {
		List<GeocodeEntity> geometries = geocodeRepository.findGeocodesAroundPosition(longitude, latitude, LOCAL_SEARCH_RADIUS_METERS);
		return markerRepository.findAllByGeometry(geometries);
	}
	
	public List<ChargingStationEntity> fetchAllChargingStationsByRadius(float longitude, float latitude) {
		List<GeocodeEntity> geometries = geocodeRepository.findGeocodesAroundPosition(longitude, latitude, LOCAL_SEARCH_RADIUS_METERS);
		return charginStationRepository.findAllByGeometry(geometries);
	}
}

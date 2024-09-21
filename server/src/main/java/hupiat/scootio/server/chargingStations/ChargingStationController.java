package hupiat.scootio.server.chargingStations;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.controllers.ICommonController;

@RequestMapping(ICommonController.API_PREFIX + "/charging_stations")
@RestController
public class ChargingStationController implements ICommonController<ChargingStationEntity> {

	private final CharginStationRepository repository;
	
	public ChargingStationController(CharginStationRepository repository) {
		super();
		this.repository = repository;
	}

	@Override
	public List<ChargingStationEntity> getAll() {
		return repository.findAll();
	}

	@Override
	public ChargingStationEntity getById(@PathVariable long id) {
		return repository.findById(id).orElseThrow();
	}

	@Override
	public ChargingStationEntity add(@RequestBody ChargingStationEntity entity) {
		return repository.save(entity);
	}

	@Override
	public ChargingStationEntity update(@RequestBody ChargingStationEntity entity) {
		return repository.save(entity);
	}

	@Override
	public void delete(@PathVariable long id) {
		repository.deleteById(id);
	}

}

package hupiat.scootio.server.markers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.controllers.ICommonController;

@RequestMapping(ICommonController.API_PREFIX + "/markers")
@RestController
public class MarkerController implements ICommonController<MarkerEntity> {

	private final MarkerRepository repository;
	private final MarkerService service;
	
	public MarkerController(MarkerRepository repository, MarkerService service) {
		super();
		this.repository = repository;
		this.service = service;
	}

	@GetMapping("{longitude},{latitude}")
	public List<MarkerEntity> getAllByRadius(@PathVariable float longitude, @PathVariable float latitude) {
		return service.fetchAllMarkersByRadius(longitude, latitude);
	}

	@Override
	public List<MarkerEntity> getAll() {
		return repository.findAll();
	}

	@Override
	public MarkerEntity getById(@PathVariable long id) {
		return repository.findById(id).orElseThrow();
	}

	@Override
	public MarkerEntity add(@RequestBody MarkerEntity entity) {
		return repository.save(entity);
	}

	@Override
	public MarkerEntity update(@RequestBody MarkerEntity entity) {
		return repository.save(entity);
	}

	@Override
	public void delete(@PathVariable long id) {
		repository.deleteById(id);
	}

}

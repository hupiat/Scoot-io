package hupiat.scootio.server.rides;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hupiat.scootio.server.core.controllers.ICommonController;

@RequestMapping(ICommonController.API_PREFIX + "/rides")
@RestController
public class RideController implements ICommonController<RideEntity> {

	private final RideRepository repository;
	
	public RideController(RideRepository repository) {
		super();
		this.repository = repository;
	}

	@Override
	public List<RideEntity> getAll() {
		return repository.findAll();
	}

	@Override
	public RideEntity getById(@PathVariable long id) {
		return repository.findById(id).orElseThrow();
	}

	@Override
	public RideEntity add(@RequestBody RideEntity entity) {
		return repository.save(entity);
	}

	@Override
	public RideEntity update(@RequestBody RideEntity entity) {
		return repository.save(entity);
	}

	@Override
	public void delete(@PathVariable long id) {
		repository.deleteById(id);
	}

}

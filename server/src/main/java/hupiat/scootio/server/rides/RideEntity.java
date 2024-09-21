package hupiat.scootio.server.rides;

import hupiat.scootio.server.core.entities.AbstractCommonEntity;
import hupiat.scootio.server.markers.GeocodeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "rides")
public class RideEntity extends AbstractCommonEntity {

	@Column(nullable = false)
	private String name;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "destination_id", referencedColumnName = "id")
	private GeocodeEntity destination;
	
	public RideEntity() {
		super();
	}

	public RideEntity(String name, GeocodeEntity destination) {
		super();
		this.name = name;
		this.destination = destination;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public GeocodeEntity getDestination() {
		return destination;
	}

	public void setDestination(GeocodeEntity destination) {
		this.destination = destination;
	}

	@Override
	public String toString() {
		return "RideEntity [name=" + name + ", destination=" + destination + "]";
	}
}

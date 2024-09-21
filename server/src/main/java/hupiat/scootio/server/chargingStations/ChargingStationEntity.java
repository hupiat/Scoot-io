package hupiat.scootio.server.chargingStations;

import hupiat.scootio.server.core.entities.AbstractCommonEntity;
import hupiat.scootio.server.markers.GeocodeEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "charging_stations")
public class ChargingStationEntity extends AbstractCommonEntity {
	
	@Column(nullable = false, unique = true)
	private String name;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "geometry_id", referencedColumnName = "id", nullable = false)
	private GeocodeEntity geometry;
	
	public ChargingStationEntity() {
		super();
	}

	public ChargingStationEntity(String name, GeocodeEntity geometry) {
		super();
		this.name = name;
		this.geometry = geometry;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public GeocodeEntity getGeometry() {
		return geometry;
	}

	public void setGeometry(GeocodeEntity geometry) {
		this.geometry = geometry;
	}

	@Override
	public String toString() {
		return "ChargingStationEntity [name=" + name + ", geometry=" + geometry + "]";
	}
}

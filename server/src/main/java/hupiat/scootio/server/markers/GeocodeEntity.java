package hupiat.scootio.server.markers;

import hupiat.scootio.server.core.entities.AbstractCommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "geocodes")
public class GeocodeEntity extends AbstractCommonEntity {
	
	@Column(nullable = false)
	private double latitude;
	
	@Column(nullable = false)
	private double longitude;

	public GeocodeEntity() {
		super();
	}

	public GeocodeEntity(float latitude, float longitude) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	@Override
	public String toString() {
		return "GeocodeEntity [latitude=" + latitude + ", longitude=" + longitude + "]";
	}
}

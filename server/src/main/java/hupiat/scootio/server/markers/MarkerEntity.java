package hupiat.scootio.server.markers;

import hupiat.scootio.server.core.entities.AbstractCommonEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "markers")
public class MarkerEntity extends AbstractCommonEntity {

	@Enumerated(EnumType.STRING)
	private MarkerType type;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "geometry_id", referencedColumnName = "id", nullable = false)
	private GeocodeEntity geometry;
	
	public MarkerEntity() {
		super();
	}

	public MarkerEntity(MarkerType type, GeocodeEntity geometry) {
		super();
		this.type = type;
		this.geometry = geometry;
	}

	public MarkerType getType() {
		return type;
	}

	public void setType(MarkerType type) {
		this.type = type;
	}

	public GeocodeEntity getGeometry() {
		return geometry;
	}

	public void setGeometry(GeocodeEntity geometry) {
		this.geometry = geometry;
	}

	@Override
	public String toString() {
		return "MarkerEntity [type=" + type + ", geometry=" + geometry + "]";
	}
}

package mk.ukim.finki.citex.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "TEST_ENTITY")
public class TestEntity extends BaseEntity {

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}

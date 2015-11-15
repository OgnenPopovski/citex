/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mk.ukim.finki.citex.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

/**
 *
 * @author Ognen
 */
@MappedSuperclass
public class BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Transient
	private String errorStatus;

	public void setErrorStatus(String errorStatus) {
		this.errorStatus = errorStatus;
	}

	public String getErrorStatus() {
		return errorStatus;
	}

	@JsonIgnore
	public boolean isNew() {
		return (this.id == null);
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof BaseEntity)) {
			return false;
		}
		BaseEntity be = (BaseEntity) obj;

		if (this.getId() == null || be.getId() == null) {
			return super.equals(obj);
		} else {
			return this.getId().equals(be.getId());
		}
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return this.id != null ? (this.getClass() + "-" + this.id).hashCode()
				: super.hashCode();
	}
}

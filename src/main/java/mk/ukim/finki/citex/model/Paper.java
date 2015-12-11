package mk.ukim.finki.citex.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.google.common.collect.Lists;

@Entity
@Table(name = "PAPERS")
public class Paper extends BaseEntity {

	@Column
	private String name;

	@Column
	private String year;

	@Column
	private Integer scholarCitations;

	@Column
	private String scholarId;

	// @Column
	// private List<Paper> citations = Lists.newArrayList();

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="AUTHORS_PAPERS",
		joinColumns =
			@JoinColumn(name="PAPER_ID", referencedColumnName="ID"),
		inverseJoinColumns=
	        @JoinColumn(name="AUTHOR_ID", referencedColumnName="ID"))
	private List<Author> authors = Lists.newArrayList();

	@Column
	private boolean processed;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public Integer getScholarCitations() {
		return scholarCitations;
	}

	public void setScholarCitations(Integer scholarCitations) {
		this.scholarCitations = scholarCitations;
	}

	// public List<Paper> getCitations() {
	// return citations;
	// }
	//
	// public void setCitations(List<Paper> citations) {
	// this.citations = citations;
	// }

	public List<Author> getAuthors() {
		return authors;
	}

	public void setAuthors(List<Author> authors) {
		this.authors = authors;
	}

	public String getScholarId() {
		return scholarId;
	}

	public void setScholarId(String scholarId) {
		this.scholarId = scholarId;
	}

	public boolean isProcessed() {
		return processed;
	}

	public void setProcessed(boolean processed) {
		this.processed = processed;
	}
}

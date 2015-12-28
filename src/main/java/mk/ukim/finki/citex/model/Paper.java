package mk.ukim.finki.citex.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.google.common.collect.Sets;

@Entity
@Table(name = "PAPERS")
public class Paper extends BaseEntity {

	@Column(length = 3000)
	private String name;

	@Column
	private String year;

	@Column
	private Integer scholarCitations;

	@Column
	private String scholarId;

	@Column(length = 3000)
	private String publicationVenue;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="PAPERS_CITED",
		joinColumns =
			@JoinColumn(name="PAPER_ID", referencedColumnName="ID"),
		inverseJoinColumns=
	        @JoinColumn(name="CITED_ID", referencedColumnName="ID"))
	private Set<Paper> citations = Sets.newHashSet();

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="AUTHORS_PAPERS",
		joinColumns =
			@JoinColumn(name="PAPER_ID", referencedColumnName="ID"),
		inverseJoinColumns=
	        @JoinColumn(name="AUTHOR_ID", referencedColumnName="ID"))
	private Set<Author> authors = Sets.newHashSet();

	@Column
	private boolean processed;

	@Column
	private Double pScore = 1D;
	
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

	 public Set<Paper> getCitations() {
	 return citations;
	 }
	
	 public void setCitations(Set<Paper> citations) {
	 this.citations = citations;
	 }

	public Set<Author> getAuthors() {
		return authors;
	}

	public void setAuthors(Set<Author> authors) {
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

	public Double getpScore() {
		return pScore;
	}

	public void setpScore(Double pScore) {
		this.pScore = pScore;
	}

	public String getPublicationVenue() {
		return publicationVenue;
	}

	public void setPublicationVenue(String publicationVenue) {
		this.publicationVenue = publicationVenue;
	}
}

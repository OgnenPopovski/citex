package mk.ukim.finki.citex.model;

import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

@Entity
@Table(name = "AUTHORS")
public class Author extends BaseEntity {

	@Column(length = 3000)
	private String name;

	@Column
	private String scholarId;

	@Column
	private Integer scholarHIndex;

	@Column
	private Long scholarI10Index;

	@Column(length = 3000)
	private String university;

	@Column
	private boolean processed;

	@ElementCollection
	private List<String> fieldsOfStudy = Lists.newArrayList();

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="AUTHORS_PAPERS",
	        joinColumns=
	            @JoinColumn(name="AUTHOR_ID", referencedColumnName="ID"),
	        inverseJoinColumns=
	            @JoinColumn(name="PAPER_ID", referencedColumnName="ID")
	        )
	private Set<Paper> papers = Sets.newHashSet();

	@Column
	private Double aScore = 1D;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getScholarId() {
		return scholarId;
	}

	public void setScholarId(String scholarId) {
		this.scholarId = scholarId;
	}

	public Integer getScholarHIndex() {
		return scholarHIndex;
	}

	public void setScholarHIndex(Integer scholarHIndex) {
		this.scholarHIndex = scholarHIndex;
	}

	public Long getScholarI10Index() {
		return scholarI10Index;
	}

	public void setScholarI10Index(Long scholarI10Index) {
		this.scholarI10Index = scholarI10Index;
	}

	public String getUniversity() {
		return university;
	}

	public void setUniversity(String university) {
		this.university = university;
	}

	public boolean isProcessed() {
		return processed;
	}

	public void setProcessed(boolean processed) {
		this.processed = processed;
	}

	public List<String> getFieldsOfStudy() {
		return fieldsOfStudy;
	}

	public void setFieldsOfStudy(List<String> fieldsOfStudy) {
		this.fieldsOfStudy = fieldsOfStudy;
	}

	public Set<Paper> getPapers() {
		return papers;
	}

	public void setPapers(Set<Paper> papers) {
		this.papers = papers;
	}

	public Double getaScore() {
		return aScore;
	}

	public void setaScore(Double aScore) {
		this.aScore = aScore;
	}
}

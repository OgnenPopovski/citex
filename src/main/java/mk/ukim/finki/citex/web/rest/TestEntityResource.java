package mk.ukim.finki.citex.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.model.TestEntity;
import mk.ukim.finki.citex.service.AuthorService;
import mk.ukim.finki.citex.service.PaperService;
import mk.ukim.finki.citex.service.TestEntityService;

@RestController
@RequestMapping("/rest/testEntity")
public class TestEntityResource extends CrudResource<TestEntity, TestEntityService>{

	@Autowired
	private TestEntityService service;
	
	@Autowired 
	private AuthorService authorService;
	
	@Autowired
	private PaperService paperService;
	
	@Override
	public TestEntityService getService() {
		return service;
	}

	@RequestMapping(value = "/author/{id}", method = RequestMethod.GET, produces = "application/json")
	public Author getAuthorById(@PathVariable Integer id) {
		return authorService.findById(id);
	}
	
	@RequestMapping(value = "/paper/{id}", method = RequestMethod.GET, produces = "application/json")
	public Paper getPaperById(@PathVariable Integer id) {
		return paperService.findById(id);
	}

	@RequestMapping(value = "/author/lets/do/this", method = RequestMethod.GET, produces = "application/json")
	public Author authorLetsDoThis() {
		Author author = new Author();
		author.getFieldsOfStudy().add("ovo");
		author.getFieldsOfStudy().add("ono");
		
		author.setName("ogi");
		author.setScholarHIndex(1);
		author.setScholarI10Index(10);
		author.setUniversity("finki");
		author.setScholarId("blablabla");
		
		Paper paper = new Paper();
		paper.setName("the winning paper");
		paper.setScholarCitations(10);
		paper.setScholarId("PPP");
		paper.setYear("2015");

		author.getPapers().add(paper);
		
		return authorService.saveAndFlush(author);
	}

	@RequestMapping(value = "/paper/lets/do/this", method = RequestMethod.GET, produces = "application/json")
	public Paper paperLetsDoThis() {
		Author author = new Author();
		author.getFieldsOfStudy().add("ovo");
		author.getFieldsOfStudy().add("ono");
		
		author.setName("ogi");
		author.setScholarHIndex(1);
		author.setScholarI10Index(10);
		author.setUniversity("finki");
		author.setScholarId("blablabla");
		
		Paper paper = new Paper();
		paper.setName("the winning paper");
		paper.setScholarCitations(10);
		paper.setScholarId("PPP");
		paper.setYear("2015");

		Paper paper1 = new Paper();
		paper1.setName("the winning paper");
		paper1.setScholarCitations(10);
		paper1.setScholarId("PPP");
		paper1.setYear("2015");
		paper.getCitations().add(paper1);
		
		paper.getAuthors().add(author);
		paper1.getAuthors().add(author);
		
		paperService.saveAndFlush(paper1);
		
		return paperService.saveAndFlush(paper);
	}

	
	
}

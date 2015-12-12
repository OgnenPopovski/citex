package mk.ukim.finki.citex.web.rest;

import java.util.List;
import java.util.Map;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.model.TestEntity;
import mk.ukim.finki.citex.service.AuthorService;
import mk.ukim.finki.citex.service.PaperService;
import mk.ukim.finki.citex.service.TestEntityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Maps;

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
		Paper paper = paperService.findById(id);
		
		List<Paper> citations = paper.getCitations();
		Map<String, Integer> stats = Maps.newHashMap();
		for (Paper citationPaper : citations) {
			stats.put(citationPaper.getName(), citationPaper.getCitations().size());
			System.out.println(citationPaper.getName() + ": " + citationPaper.getCitations().size());
		}
		
		return paper;
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
		paper.setName("paper");
		paper.setScholarCitations(10);
		paper.setScholarId("PPP");
		paper.setYear("2015");
		paper.getAuthors().add(author);

		Paper paper1 = new Paper();
		paper1.setName("paper1");
		paper1.setScholarCitations(10);
		paper1.setScholarId("PPP1");
		paper1.setYear("2015");
		paper1.getAuthors().add(author);
		paper.getCitations().add(paper1);

		Paper paper2 = new Paper();
		paper2.setName("paper2");
		paper2.setScholarCitations(10);
		paper2.setScholarId("PPP2");
		paper2.setYear("2015");
		paper2.getAuthors().add(author);
		paper.getCitations().add(paper2);
		paper1.getCitations().add(paper2);
		
		paperService.saveAndFlush(paper2);
		paperService.saveAndFlush(paper1);
		
		return paperService.saveAndFlush(paper);
	}

	
	
}

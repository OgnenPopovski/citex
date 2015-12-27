package mk.ukim.finki.citex.web.rest;

import java.util.Map;
import java.util.Set;

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
		
		Set<Paper> citations = paper.getCitations();
		Map<String, Integer> stats = Maps.newHashMap();
		for (Paper citationPaper : citations) {
			stats.put(citationPaper.getName(), citationPaper.getCitations().size());
			System.out.println(citationPaper.getName() + ": " + citationPaper.getCitations().size());
		}
		
		return paper;
	}

	
}

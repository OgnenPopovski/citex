package mk.ukim.finki.citex.web.rest;

import java.util.List;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.service.AuthorService;
import mk.ukim.finki.citex.service.CitexScoreService;
import mk.ukim.finki.citex.service.PaperService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/test")
public class TestController {

	@Autowired
	private CitexScoreService citexScoreService;
	
	@Autowired
	private PaperService paperService;
	
	@Autowired
	private AuthorService authorService;
	
	@RequestMapping(method = RequestMethod.GET)
	public String test() {
		return "test";
	}

	@RequestMapping(value = "/calcScores", method = RequestMethod.GET)
	public String testScoreCalculation() {
		
		List<Author> authors = (List<Author>) authorService.findAll();
		List<Paper> papers = (List<Paper>) paperService.findAll();
		
		citexScoreService.calculateCitexScore(authors, papers);
		
		return "test";
	}
	
	
}

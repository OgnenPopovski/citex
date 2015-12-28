package mk.ukim.finki.citex.web.rest;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.service.AuthorService;
import mk.ukim.finki.citex.service.CitexScoreService;
import mk.ukim.finki.citex.service.ClassicScoreService;
import mk.ukim.finki.citex.service.PaperService;

@Controller
@RequestMapping("/calcScores")
public class ScoreCalculationController {

	@Autowired
	private CitexScoreService citexScoreService;
	
	@Autowired
	private PaperService paperService;
	
	@Autowired
	private AuthorService authorService;
	
	@Autowired 
	private ClassicScoreService hIndexService;
	
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, String> calculateAll() {
		
		List<Author> authors = (List<Author>) authorService.findAll();
		List<Paper> papers = (List<Paper>) paperService.findAll();
		
		hIndexService.calculateHIndexScore(authors);
		hIndexService.calculateI10Score(authors);
		citexScoreService.calculateCitexScore(authors, papers);
		
		return Collections.singletonMap("result", "calculating all scores done");
	}

	@RequestMapping(value = "/citex", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, String> calculateCitex() {
		
		List<Author> authors = (List<Author>) authorService.findAll();
		List<Paper> papers = (List<Paper>) paperService.findAll();
		
		citexScoreService.calculateCitexScore(authors, papers);
		
		return Collections.singletonMap("result", "calculating citex score done");
	}

	@RequestMapping(value = "/hIndex", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, String> calculateHIndex() {
		
		List<Author> authors = (List<Author>) authorService.findAll();
		
		hIndexService.calculateHIndexScore(authors);
		
		return Collections.singletonMap("result", "calculating hIndex score done");
	}

	@RequestMapping(value = "/i10", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public Map<String, String> calculateI10() {
		
		List<Author> authors = (List<Author>) authorService.findAll();
		
		hIndexService.calculateI10Score(authors);
		
		return Collections.singletonMap("result", "calculating i10 score done");
	}
}

package mk.ukim.finki.citex.web.rest;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.List;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.repository.AuthorRepository;
import mk.ukim.finki.citex.repository.PaperRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;

@Controller
@RequestMapping(value = "/static")
public class StaticDataImportController {
	
	@Autowired
	private AuthorRepository authorRepository;
	
	@Autowired
	private PaperRepository paperRepository;
	
	private SecureRandom random = new SecureRandom();

	@RequestMapping(value = "/data/replicate", 
			method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String replicateCitexPaperData() {
		Author a1 = new Author();
		a1 = authorRepository.saveAndFlush(a1);
		Author a2 = new Author();
		a2 = authorRepository.saveAndFlush(a2);
		Author a3 = new Author();
		a3 = authorRepository.saveAndFlush(a3);
		Author a4 = new Author();
		a4 = authorRepository.saveAndFlush(a4);
		
		Paper p1 = new Paper();
		p1 = paperRepository.saveAndFlush(p1);
		Paper p2 = new Paper();
		p2 = paperRepository.saveAndFlush(p2);
		Paper p3 = new Paper();
		p3 = paperRepository.saveAndFlush(p3);
		Paper p4 = new Paper();
		p4 = paperRepository.saveAndFlush(p4);
		Paper p5 = new Paper();
		p5 = paperRepository.saveAndFlush(p5);
		
		a1.getPapers().add(p1);
		a1.getPapers().add(p3);
		a1.getPapers().add(p5);
		a1 = authorRepository.saveAndFlush(a1);
		
		a2.getPapers().add(p2);
		a2.getPapers().add(p4);
		a2 = authorRepository.saveAndFlush(a2);
		
		a3.getPapers().add(p2);
		a3.getPapers().add(p3);
		a3.getPapers().add(p5);
		a3 = authorRepository.saveAndFlush(a3);

		a4.getPapers().add(p1);
		a4.getPapers().add(p3);
		a4.getPapers().add(p4);
		a4.getPapers().add(p5);
		a4 = authorRepository.saveAndFlush(a4);

		p1.getCitations().add(p2);
		p1.getCitations().add(p3);
		p1.getCitations().add(p5);
		p1 = paperRepository.saveAndFlush(p1);

		p2.getCitations().add(p3);
		p2.getCitations().add(p4);
		p2 = paperRepository.saveAndFlush(p2);

		p3.getCitations().add(p5);
		p3 = paperRepository.saveAndFlush(p3);

		p4.getCitations().add(p5);
		p4 = paperRepository.saveAndFlush(p4);
		
		p5.getCitations().clear();
		p5 = paperRepository.saveAndFlush(p5);
		return "done";
	}
	
	@RequestMapping(value = "/data/generate/authors/{authorAddCount}/papers/{paperAddCount}", 
			method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String importData(@PathVariable Integer authorAddCount, @PathVariable Integer paperAddCount) {
		
		List<Author> allAuthors = authorRepository.findAll();
		List<Paper> allPapers = paperRepository.findAll();
		int authorCount = allAuthors.size();
		int paperCount = allPapers.size();

		List<Author> newAuthors = Lists.newArrayList();
		List<Paper> newPapers = Lists.newArrayList();
		
		for (int i = 0; i < authorAddCount; i++) {
			
			Author author = new Author();
			author.setName(generateRandomString());
			author.setScholarHIndex(random.nextInt(20));
			author.setScholarI10Index(random.nextInt(30));
			author.setUniversity(universitiesStatic[random.nextInt(universitiesStatic.length - 1)]);
			author.setScholarId(generateRandomString());
			
			int randomInt = random.nextInt(fieldsOfStudyStatic.length - 2) + 1;
			if(randomInt == 0) {
				randomInt = random.nextInt(fieldsOfStudyStatic.length - 2) + 1;
			}
			
			for (int j = 0; j < randomInt; j++) {
				author.getFieldsOfStudy().add(fieldsOfStudyStatic[j]);
			}
			
			author = authorRepository.saveAndFlush(author);
			newAuthors.add(author);
			authorCount++;
		}
		
		for (int i = 0; i < paperAddCount; i++) {
			Paper paper = new Paper();
			paper.setName(generateRandomString());
			paper.setScholarId(generateRandomString());
			paper = paperRepository.saveAndFlush(paper);
			newPapers.add(paper);
			paperCount++;
		}
		
		for (Paper paper : newPapers) {
			int citations = random.nextInt(paperCount - 1) + 1;
			for (int i = 0; i < citations; i++) {
				int randomPaperId = random.nextInt(paperCount - 1) + 1;
				Paper cite = paperRepository.findOne(randomPaperId);
				if (cite == null) {
					continue;
				}
				paper.getCitations().add(cite);
			}
			paperRepository.save(paper);
		}

		for (Paper paper : newPapers) {
			int authors = random.nextInt(9) + 1;
			for (int i = 0; i < authors; i++) {
				int randomAuthorId = random.nextInt(authorCount - 1) + 1;
				Author author = authorRepository.findOne(randomAuthorId);
				if (author == null) {
					continue;
				}
				paper.getAuthors().add(author);
			}
			paperRepository.save(paper);
		}
		
		return "done";
	}
	
	private String generateRandomString() {
		return new BigInteger(130, random).toString(32);
	}

	private String [] fieldsOfStudyStatic 
		= {"COMPUTER ENGINEERING",
		   "COMPUTER NETWORKS",
		   "SOFTWARE ENGINEERING",
		   "TELECOMMUNICATIONS ENGINEERING",
		   "NEURAL NETWORKS",
		   "ARTIFICIAL INTELLIGENCE"};
	
	private String [] universitiesStatic
		= {"Cambridge",
		   "Oxford",
		   "York",
		   "Leeds",
		   "King's College London",
		   "Harvard University",
		   "University of Chicago",
		   "University of Toronto",
		   "Northwestern University"};
	
}

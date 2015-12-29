package mk.ukim.finki.citex.service.impl;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.repository.AuthorRepository;
import mk.ukim.finki.citex.service.ClassicScoreService;

@Service
public class ClassicScoreServiceImpl implements ClassicScoreService{

	@Autowired
	private AuthorRepository authorRepository;
	
	@Override
	public void calculateHIndexScore(List<Author> authors) {

		for (Author author : authors) {
			
			Set<Paper> papers = author.getPapers();
			
			if (papers.isEmpty()) {
				author.setScholarHIndex(0);
				continue;
			}
			
			if (papers.size() == 1) {
				author.setScholarHIndex(0);
				continue;
			}
			
			List<Paper> paperList = Lists.newArrayList(papers);
			paperList.sort((p1, p2) -> ((Integer) p2.getCitations().size()).compareTo(p1.getCitations().size()));
			System.out.println();

			if(paperList.size() == 2 && paperList.get(1).getCitations().size() == 1) {
				author.setScholarHIndex(1);
				continue;
			}
			
			Paper lastPaper = paperList.get(paperList.size()-1);
			if (lastPaper.getCitations().size() > (paperList.size() - 1)) {
				author.setScholarHIndex(paperList.size() - 1);
				continue;
			}
			
			for (int i = 0; i < paperList.size(); i++) {
				Paper paper = paperList.get(i);
				int paperNumberOfCitations = paper.getCitations().size();
				if (paperNumberOfCitations < i) {
					author.setScholarHIndex(i - 1);
					break;
				}
			}
		}
		
		authorRepository.save(authors);
		authorRepository.flush();
	}

	@Override
	public void calculateI10Score(List<Author> authors) {
		
		authors.stream().forEach(
				a -> a.setScholarI10Index(
						a.getPapers().stream()
									 .filter(paper -> paper.getCitations().size() >= 10)
									 .count()));

		authorRepository.save(authors);
		authorRepository.flush();
	}

}

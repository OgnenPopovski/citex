package mk.ukim.finki.citex.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.repository.AuthorRepository;
import mk.ukim.finki.citex.repository.PaperRepository;
import mk.ukim.finki.citex.service.CitexScoreService;
import mk.ukim.finki.citex.service.util.CitexScoreUtils;

import org.apache.commons.lang.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Maps;

@Service
public class CitexScoreServiceImpl implements CitexScoreService {

	@Autowired
	private AuthorRepository authorRepository;

	@Autowired
	private PaperRepository paperRepository;
	
	public void calculateCitexScore(List<Author> authors, List<Paper> papers) {
		
		double[] authorScores = new double[authors.size()];
		CitexScoreUtils.initializeScoreVector(authorScores);
		double[] paperScores = new double[papers.size()];
		CitexScoreUtils.initializeScoreVector(paperScores);
		
		double[] previousAuthorScores = new double[authors.size()];
		CitexScoreUtils.initializeScoreVector(previousAuthorScores);
		double[] previousPaperScores = new double[papers.size()];
		CitexScoreUtils.initializeScoreVector(previousPaperScores);
		
		Map<Integer, Integer> authorIdMap = Maps.newHashMap();
		Map<Integer, Integer> paperIdMap = Maps.newHashMap();
		
		CitexScoreUtils.populateAuthorIdMap(authors, authorIdMap);
		CitexScoreUtils.populatePaperIdMap(papers, paperIdMap);
		
		int iterationCount = 0;
		
		paperScores = CitexScoreUtils.normalizeScore(paperScores);
		authorScores = CitexScoreUtils.normalizeScore(authorScores);
		
		do {
			previousAuthorScores = ArrayUtils.clone(authorScores);
			previousPaperScores = ArrayUtils.clone(paperScores);
			System.out.println("iteration: " + ++iterationCount);

			/*
			 * 1) pScore = initPScore/k, k = |AUTHORS(pj)|
			 */
			for (int i = 0; i< papers.size(); i++) {
				Paper currentPaper = papers.get(i);
				double currentPScore = paperScores[paperIdMap.get(currentPaper.getId())];
				double pScore = currentPScore / currentPaper.getAuthors().size();
				paperScores[paperIdMap.get(currentPaper.getId())] = pScore;
			}

			/*
			 * 2) aScore = sum(p.pScore), p is paper that author has written
			 */
			for (int i = 0; i < authors.size(); i++) {
				Author author = authors.get(i);
				Set<Paper> papersFromAuthor = author.getPapers();
				double aScore = 0;
				for (Paper paper : papersFromAuthor) {
					aScore += paperScores[paperIdMap.get(paper.getId())];
				}
				authorScores[authorIdMap.get(author.getId())] = aScore;
			}

			/*
			 * 3) pScore = sum(a.aScore)), a is author of the paper
			 */
			for (int i = 0; i < papers.size(); i++) {
				Paper paper = papers.get(i);
				double pScore = 0;
				Set<Author> coAuthors = paper.getAuthors();
				for (Author coAuthor : coAuthors) {
					pScore += authorScores[authorIdMap.get(coAuthor.getId())];
				}
				paperScores[paperIdMap.get(paper.getId())] = pScore;
			}

			/*
			 * 4) pScore = currentPScore + sum(p.pScore), p is paper that has
			 * cited the paper.
			 */
			for (int i = 0; i < papers.size(); i++) {
				Paper paper = papers.get(i);
				double pScore = 0;
				Set<Paper> coAuthors = paper.getCitations();
				for (Paper citation : coAuthors) {
					pScore += paperScores[paperIdMap.get(citation.getId())];
				}
				double calcPScore = pScore + paperScores[paperIdMap.get(paper.getId())];
				paperScores[paperIdMap.get(paper.getId())] = calcPScore;
			}
			
			paperScores = CitexScoreUtils.normalizeScore(paperScores);
			authorScores = CitexScoreUtils.normalizeScore(authorScores);

		} while (!equalArray(previousPaperScores, paperScores)
				&& !equalArray(previousAuthorScores, authorScores));

		
		System.out.println("[previous] results author scores: " + Arrays.toString(previousAuthorScores));
		System.out.println("[previous] results paper scores: " + Arrays.toString(previousPaperScores));
		System.out.println(System.lineSeparator() + System.lineSeparator() + "=========================================================================" + System.lineSeparator() + System.lineSeparator());
		System.out.println("results author scores: " + Arrays.toString(authorScores));
		System.out.println("results paper scores: " + Arrays.toString(paperScores));
		
		for (Author author : authors) {
			author.setaScore(authorScores[authorIdMap.get(author.getId())]);
		}
		
		System.out.println(System.lineSeparator() + "Citex top 20 authors: ");
		
		authors.sort((author1, author2) -> author2.getaScore().compareTo(author1.getaScore()));
		authors.stream().limit(20)
						.forEach(a -> System.out.println(a.getId() + " " + a.getName() + " " + a.getaScore()));
		
	}

	private boolean equalArray(double[] authorScores,
			double[] previousAuthorScores) {
		for (int i = 0; i < authorScores.length; i++) {
			if (authorScores[i] != previousAuthorScores[i]) {
				return false;
			}
		}
		return true;
	}

}
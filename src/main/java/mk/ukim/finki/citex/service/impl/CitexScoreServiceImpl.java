package mk.ukim.finki.citex.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.repository.AuthorRepository;
import mk.ukim.finki.citex.repository.PaperRepository;
import mk.ukim.finki.citex.service.CitexScoreService;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

@Service
public class CitexScoreServiceImpl implements CitexScoreService {

	@Autowired
	private PaperRepository paperRepository;
	
	@Autowired
	private AuthorRepository authorRepository;
	
	public void calculateCitexScore(List<Author> authors, List<Paper> papers) {
		resetState(authors, papers);
		
		double[] authorScores = new double[authors.size()];
		initializeScoreVector(authorScores);
		double[] paperScores = new double[papers.size()];
		initializeScoreVector(paperScores);
		
		Map<Integer, Integer> publicationMatrixMap = Maps.newHashMap();
		Map<Integer, Integer> citationMatrixMap = Maps.newHashMap();
		
		int[][] publicationMatrix = generatePublicatoinMatrix(authors, papers, publicationMatrixMap, citationMatrixMap);
		int[][] citationMatrix = generateCitationMatrix(papers, citationMatrixMap);
		
		HashCodeBuilder hashCodeBuilder = new HashCodeBuilder();
		
		int authorScoreHashCode = hashCodeBuilder.append(authorScores).toHashCode(); 
		int paperScoreHashCode = hashCodeBuilder.append(paperScores).toHashCode();
		
		int authorScoreHashCodePrev = 0;
		int paperScoreHashCodePrev = 0;

		int iterationCount = 0;
		
		while (authorScoreHashCodePrev != authorScoreHashCode
				&& paperScoreHashCode != paperScoreHashCodePrev) {
			System.out.println("iteration: " + ++iterationCount);
			/*
			 * 1) pScore = initPScore/k, k = |AUTHORS(pj)|
			 */
			for (int i = 0; i< papers.size(); i++) {
				Paper currentPaper = papers.get(i);
				Paper p = paperRepository.findOne(currentPaper.getId());
				double currentPScore = currentPaper.getpScore();
				double pScore = currentPScore / p.getAuthors().size();
				p.setpScore(pScore);
				// persist
				paperRepository.save(p);
				paperScores[i] = pScore;
			}

			/*
			 * 2) aScore = sum(p.pScore), p is paper that author has written
			 */
			for (int i = 0; i < authors.size(); i++) {
				Author author = authors.get(i);
				Set<Paper> papersFromAuthor = papers(author);
				double aScore = 0;
				for (Paper paper : papersFromAuthor) {
					aScore += paper.getpScore();
				}
				author.setaScore(aScore);
				// persist
				authorRepository.save(author);
				authorScores[i] = aScore;
			}

			/*
			 * 3) pScore = sum(a.aScore)), a is author of the paper
			 */
			for (int i = 0; i < papers.size(); i++) {
				Paper paper = papers.get(i);
				double pScore = 0;
				Set<Author> coAuthors = authors(paper);
				for (Author coAuthor : coAuthors) {
					pScore += coAuthor.getaScore();
				}
				paper.setpScore(pScore);
				// persist
				paperRepository.save(paper);
				paperScores[i] = pScore;
			}

			/*
			 * 4) pScore = currentPScore + sum(p.pScore), p is paper that has
			 * cited the paper.
			 */
			for (int i = 0; i < papers.size(); i++) {
				Paper paper = papers.get(i);
				double pScore = 0;
				Set<Paper> coAuthors = cite(paper);
				for (Paper coAuthor : coAuthors) {
					pScore += coAuthor.getpScore();
				}
				double calcPScore = (pScore + paper.getpScore()) > Double.MAX_VALUE ? Double.MAX_VALUE
						: pScore + paper.getpScore();
				paper.setpScore(calcPScore);
				// persist
				paperRepository.save(paper);
				paperScores[i] = calcPScore;
			}
			
			authorScoreHashCodePrev = authorScoreHashCode;
			paperScoreHashCodePrev = paperScoreHashCode;
			
			authorScoreHashCode = hashCodeBuilder.append(authorScores).toHashCode(); 
			paperScoreHashCode = hashCodeBuilder.append(paperScores).toHashCode(); 
		}
		
		System.out.println(Arrays.toString(authorScores));
		System.out.println(Arrays.toString(paperScores));
		
	}

	private int[][] generateCitationMatrix(List<Paper> papers,
			Map<Integer, Integer> citationMatrixMap) {

		int[][] citationMatrix = new int[papers.size()][papers.size()];
		
		for (int i = 0; i < papers.size(); i++) {
			Paper paper = papers.get(i);
			Set<Integer> paperCitationIds = paper.getCitations().stream()
					.map(q -> q.getId()).collect(Collectors.toSet());
			for (Integer paperCitationId : paperCitationIds) {
				int citationIndex = citationMatrixMap.get(paperCitationId);
				citationMatrix[i][citationIndex] = 1;
			}
		}
		
		return citationMatrix;
	}

	private int[][] generatePublicatoinMatrix(List<Author> authors,
			List<Paper> papers, 
			Map<Integer, Integer> publicationMatrixMap, 
			Map<Integer, Integer> citationMatrixMap) {

		int[][] publicationMatrix = new int[authors.size()][papers.size()];
		
		initializePublicationMatrix(publicationMatrix);
		
		populatePublicationMap(authors, publicationMatrixMap);
		populateCitationMap(papers, citationMatrixMap);
		
		for (int i = 0; i < authors.size(); i++) {
			Author author = authors.get(i);
			Set<Integer> authorPaperIds = author.getPapers().stream()
					.map(q -> q.getId()).collect(Collectors.toSet());
			for (Integer paperId : authorPaperIds) {
				int paperIndex = citationMatrixMap.get(paperId);
				publicationMatrix[i][paperIndex] = 1;
			}
		}
		
		return publicationMatrix;
	}

	private void populateCitationMap(List<Paper> papers,
			Map<Integer, Integer> citationMatrixMap) {
		for (int i = 0; i < papers.size(); i++) {
			citationMatrixMap.put(papers.get(i).getId(), i);
		}
	}

	private void populatePublicationMap(List<Author> authors,
			Map<Integer, Integer> publicationMatrixMap) {
		for (int i = 0; i < authors.size(); i++) {
			publicationMatrixMap.put(authors.get(i).getId(), i);
		}
	}

	private void initializePublicationMatrix(int[][] publicatoinMatrix) {
		for (int[] row : publicatoinMatrix) {
			Arrays.fill(row, 0);
		}
	}

	private void initializeScoreVector(double[] scoreVector) {
		Arrays.fill(scoreVector, 1);
	}

	private Set<Paper> papers(Author author) {
		return authorRepository.findOne(author.getId()).getPapers();
	}

	private Set<Author> authors(Paper paper) {
		return paperRepository.findOne(paper.getId()).getAuthors();
	}

	private Set<Paper> cite(Paper paper) {
		return paperRepository.findOne(paper.getId()).getCitations();
	}

	private List<Paper> references(Paper p) {
		return Lists.newArrayList();
	}

	private void resetState(List<Author> authors, List<Paper> papers) {
		for (Paper paper : papers) {
			paper.setpScore(1D);
		}
		authorRepository.save(authors);
		for (Author author : authors) {
			author.setaScore(1D);
		}
		paperRepository.save(papers);
	}
}

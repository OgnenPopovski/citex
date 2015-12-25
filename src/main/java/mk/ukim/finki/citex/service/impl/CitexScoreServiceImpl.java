package mk.ukim.finki.citex.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.service.CitexScoreService;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.math.util.MathUtils;
import org.springframework.stereotype.Service;

import com.google.common.collect.Maps;

@Service
public class CitexScoreServiceImpl implements CitexScoreService {

	public void calculateCitexScore(List<Author> authors, List<Paper> papers) {
		
		double[] authorScores = new double[authors.size()];
		initializeScoreVector(authorScores);
		double[] paperScores = new double[papers.size()];
		initializeScoreVector(paperScores);
		
		double[] previousAuthorScores = new double[authors.size()];
		initializeScoreVector(previousAuthorScores);
		
		double[] previousPaperScores = new double[papers.size()];
		initializeScoreVector(previousPaperScores);
		
		Map<Integer, Integer> authorIdMap = Maps.newHashMap();
		Map<Integer, Integer> paperIdMap = Maps.newHashMap();
		
		populateAuthorIdMap(authors, authorIdMap);
		populatePaperIdMap(papers, paperIdMap);
		
		int iterationCount = 0;
		
		paperScores = normalizeScore(paperScores);
		authorScores = normalizeScore(authorScores);
		
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
			
			paperScores = normalizeScore(paperScores);
			authorScores = normalizeScore(authorScores);

//			System.out.println("results author scores: " + Arrays.toString(authorScores));
//			System.out.println("results paper scores: " + Arrays.toString(paperScores));
		} while (!equalArray(previousPaperScores, paperScores)
				&& !equalArray(previousAuthorScores, authorScores));

		
		System.out.println("[previous] results author scores: " + Arrays.toString(previousAuthorScores));
		System.out.println("[previous] results paper scores: " + Arrays.toString(previousPaperScores));
		System.out
				.println(System.lineSeparator()
						+ "========================================================================="
						+ System.lineSeparator());
		System.out.println("results author scores: " + Arrays.toString(authorScores));
		System.out.println("results paper scores: " + Arrays.toString(paperScores));
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

	private double[] normalizeScore(double[] score) {
		double[] normalized = MathUtils.normalizeArray(score, 1);
		return normalized;
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
			Map<Integer, Integer> authorIdMap, 
			Map<Integer, Integer> paperIdMap) {

		int[][] publicationMatrix = new int[authors.size()][papers.size()];
		
		initializeMatrix(publicationMatrix);
		
		for (int i = 0; i < authors.size(); i++) {
			Author author = authors.get(i);
			Set<Integer> authorPaperIds = author.getPapers().stream()
					.map(q -> q.getId()).collect(Collectors.toSet());
			for (Integer paperId : authorPaperIds) {
				int paperIndex = paperIdMap.get(paperId);
				publicationMatrix[i][paperIndex] = 1;
			}
		}
		
		return publicationMatrix;
	}

	private void populatePaperIdMap(List<Paper> papers,
			Map<Integer, Integer> citationMatrixMap) {
		for (int i = 0; i < papers.size(); i++) {
			citationMatrixMap.put(papers.get(i).getId(), i);
		}
	}

	private void populateAuthorIdMap(List<Author> authors,
			Map<Integer, Integer> publicationMatrixMap) {
		for (int i = 0; i < authors.size(); i++) {
			publicationMatrixMap.put(authors.get(i).getId(), i);
		}
	}

	private void initializeMatrix(int[][] publicatoinMatrix) {
		for (int[] row : publicatoinMatrix) {
			Arrays.fill(row, 0);
		}
	}

	private void initializeScoreVector(double[] scoreVector) {
		Arrays.fill(scoreVector, 1);
	}

	private Double getRoundedDouble(Double number) {
		return new BigDecimal(number).setScale(4, RoundingMode.HALF_UP).doubleValue();
	}
}

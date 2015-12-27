package mk.ukim.finki.citex.service.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.math.util.MathUtils;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;

public class CitexScoreUtils {

	public static double[] normalizeScore(double[] score) {
		double[] normalized = MathUtils.normalizeArray(score, 1);
		return normalized;
	}

	public static int[][] generateCitationMatrix(List<Paper> papers, Map<Integer, Integer> citationMatrixMap) {

		int[][] citationMatrix = new int[papers.size()][papers.size()];

		for (int i = 0; i < papers.size(); i++) {
			Paper paper = papers.get(i);
			Set<Integer> paperCitationIds = paper.getCitations().stream().map(q -> q.getId())
					.collect(Collectors.toSet());
			for (Integer paperCitationId : paperCitationIds) {
				int citationIndex = citationMatrixMap.get(paperCitationId);
				citationMatrix[i][citationIndex] = 1;
			}
		}

		return citationMatrix;
	}

	public static int[][] generatePublicatoinMatrix(List<Author> authors, List<Paper> papers,
			Map<Integer, Integer> authorIdMap, Map<Integer, Integer> paperIdMap) {

		int[][] publicationMatrix = new int[authors.size()][papers.size()];

		initializeMatrix(publicationMatrix);

		for (int i = 0; i < authors.size(); i++) {
			Author author = authors.get(i);
			Set<Integer> authorPaperIds = author.getPapers().stream().map(q -> q.getId()).collect(Collectors.toSet());
			for (Integer paperId : authorPaperIds) {
				int paperIndex = paperIdMap.get(paperId);
				publicationMatrix[i][paperIndex] = 1;
			}
		}

		return publicationMatrix;
	}

	public static void populatePaperIdMap(List<Paper> papers, Map<Integer, Integer> citationMatrixMap) {
		for (int i = 0; i < papers.size(); i++) {
			citationMatrixMap.put(papers.get(i).getId(), i);
		}
	}

	public static void populateAuthorIdMap(List<Author> authors, Map<Integer, Integer> publicationMatrixMap) {
		for (int i = 0; i < authors.size(); i++) {
			publicationMatrixMap.put(authors.get(i).getId(), i);
		}
	}

	public static void initializeMatrix(int[][] publicatoinMatrix) {
		for (int[] row : publicatoinMatrix) {
			Arrays.fill(row, 0);
		}
	}

	public static void initializeScoreVector(double[] scoreVector) {
		Arrays.fill(scoreVector, 1);
	}

	public static Double getRoundedDouble(Double number) {
		return new BigDecimal(number).setScale(4, RoundingMode.HALF_UP).doubleValue();
	}
}

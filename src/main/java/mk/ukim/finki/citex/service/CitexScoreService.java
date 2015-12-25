package mk.ukim.finki.citex.service;

import java.util.List;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;

public interface CitexScoreService {

	void calculateCitexScore(List<Author> authors, List<Paper> papers);

}

package mk.ukim.finki.citex.service;

import java.util.List;

import mk.ukim.finki.citex.model.Author;

public interface ClassicScoreService {
	
	void calculateHIndexScore(List<Author> authors);
	void calculateI10Score(List<Author> authors);
}

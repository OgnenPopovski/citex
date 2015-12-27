package mk.ukim.finki.citex.repository;

import mk.ukim.finki.citex.model.Author;

public interface AuthorRepository extends JpaSpecificationRepository<Author> {

	Author findAuthorByName(String name);
	
}

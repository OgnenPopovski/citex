package mk.ukim.finki.citex.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.repository.AuthorRepository;
import mk.ukim.finki.citex.service.AuthorService;

@Service
public class AuthorServiceImpl extends BaseEntityCrudServiceImpl<Author, AuthorRepository> implements AuthorService {

	@Autowired
	private AuthorRepository repo;	
	
	@Override
	protected AuthorRepository getRepository() {
		return repo;
	}

}

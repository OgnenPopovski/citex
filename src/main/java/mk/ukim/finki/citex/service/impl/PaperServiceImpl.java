package mk.ukim.finki.citex.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.repository.PaperRepository;
import mk.ukim.finki.citex.service.PaperService;

@Service
public class PaperServiceImpl extends BaseEntityCrudServiceImpl<Paper, PaperRepository> implements PaperService {

	@Autowired
	private PaperRepository repo;
	
	@Override
	protected PaperRepository getRepository() {
		return repo;
	}

}

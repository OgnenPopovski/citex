package mk.ukim.finki.citex.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mk.ukim.finki.citex.model.TestEntity;
import mk.ukim.finki.citex.repository.TestEntityRepository;
import mk.ukim.finki.citex.service.TestEntityService;

@Service
public class TestEntityServiceImpl extends BaseEntityCrudServiceImpl<TestEntity, TestEntityRepository> implements TestEntityService {

	@Autowired
	private TestEntityRepository repository;
	
	@Override
	protected TestEntityRepository getRepository() {
		return repository;
	}

}

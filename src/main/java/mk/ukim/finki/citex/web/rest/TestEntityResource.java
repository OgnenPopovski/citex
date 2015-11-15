package mk.ukim.finki.citex.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mk.ukim.finki.citex.model.TestEntity;
import mk.ukim.finki.citex.service.TestEntityService;

@RestController
@RequestMapping("/rest/testEntity")
public class TestEntityResource extends CrudResource<TestEntity, TestEntityService>{

	@Autowired
	private TestEntityService service;
	
	@Override
	public TestEntityService getService() {
		return service;
	}

}

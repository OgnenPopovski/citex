package mk.ukim.finki.citex.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import mk.ukim.finki.citex.service.impl.ImportDataset;
import mk.ukim.finki.citex.service.impl.StaticDataGenerator;

@Controller
@RequestMapping(value = "/static/data")
public class StaticDataImportController {
	
	@Autowired
	private ImportDataset datasetImporter;
	
	@Autowired
	private StaticDataGenerator staticDataGenerator;
	
	@RequestMapping(value = "/import/dataset", 
			method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String importDataset() throws URISyntaxException, IOException {
		
		datasetImporter.importDataset();
		
		return "done";
	}

	@RequestMapping(value = "/replicate/example/{exampleNum}", 
			method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String replicateCitexPaperData(@PathVariable Integer exampleNum) {
		
		if (exampleNum.equals(1)) {
			staticDataGenerator.example1();
		} else if (exampleNum.equals(2)) {
			staticDataGenerator.example2();
		}
		
		return "done";
	}

	@RequestMapping(value = "/generate/authors/{authorAddCount}/papers/{paperAddCount}", 
			method = RequestMethod.GET, 
			produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public String importData(@PathVariable Integer authorAddCount, @PathVariable Integer paperAddCount) {
		
		staticDataGenerator.generateRandomData(authorAddCount, paperAddCount);
		
		return "done";
	}
	
}

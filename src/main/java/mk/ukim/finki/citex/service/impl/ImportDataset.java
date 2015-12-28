package mk.ukim.finki.citex.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.dandelion.datatables.core.util.StringUtils;

import mk.ukim.finki.citex.model.Author;
import mk.ukim.finki.citex.model.Paper;
import mk.ukim.finki.citex.repository.AuthorRepository;
import mk.ukim.finki.citex.repository.PaperRepository;
import mk.ukim.finki.citex.service.util.CNDLinePrefix;

@Service
public class ImportDataset {

	private static final Logger LOGGER = LoggerFactory.getLogger(ImportDataset.class);
	
	private static final String PUBLICATIONS_DATASET = "files/dataset/publications.txt";
	
	private static final String TEST_DATASET = "files/dataset/test.txt";
	
	private static final String SOFTWARE_ENGINEERING_DATASET = "files/dataset/domains/Software_engineering.txt";

	@Autowired
	private AuthorRepository authorRepository;

	@Autowired
	private PaperRepository paperRepository;
	
	
	public String importDataset() throws URISyntaxException, IOException {
		Path path = Paths.get(getClass().getClassLoader().getResource(SOFTWARE_ENGINEERING_DATASET).toURI());
		File datasetResource = path.toFile();
		LineIterator lineIterator = FileUtils.lineIterator(datasetResource, StandardCharsets.UTF_8.name());
		try {
			Paper paper = new Paper();
			while(lineIterator.hasNext()) {
				String line = lineIterator.nextLine();
				
				if (StringUtils.isBlank(line)) {
//					LOGGER.info("paper saved. Paper identifier: {}", paper.getScholarId());
					System.out.println("paper saved. Paper identifier: " + paper.getScholarId());
					// save
					paperRepository.saveAndFlush(paper);
					paper = new Paper();
					continue;
				}
				parseLine(paper, line);
			}
		} finally {
			LineIterator.closeQuietly(lineIterator);
		}
			
		return "";
	}

	private void parseLine(Paper paper, String line) {
		
		if (line.startsWith(CNDLinePrefix.PAPER_TITLE.getValue())) {
			line = line.replace(CNDLinePrefix.PAPER_TITLE.getValue(), StringUtils.EMPTY);
			paper.setName(line);
//			System.out.println("TITLE: " + line);
			
		} else if (line.startsWith(CNDLinePrefix.AUTHORS.getValue())) {
			line = line.replace(CNDLinePrefix.AUTHORS.getValue(), StringUtils.EMPTY);
			handleAuthorRelations(paper, line);
//			System.out.println("AUTHORS: " + line);
			
		} else if (line.startsWith(CNDLinePrefix.YEAR.getValue())) {
			line = line.replace(CNDLinePrefix.YEAR.getValue(), StringUtils.EMPTY);
			paper.setYear(line);
//			System.out.println("YEAR: " + line);
			
		} else if (line.startsWith(CNDLinePrefix.PUBLICATION_VENUE.getValue())) {
			line = line.replace(CNDLinePrefix.PUBLICATION_VENUE.getValue(), StringUtils.EMPTY);
			paper.setPublicationVenue(line);
//			System.out.println("PUBLICATION VENUE: " + line);
			
		} else if (line.startsWith(CNDLinePrefix.INDEX.getValue())) {
			line = line.replace(CNDLinePrefix.INDEX.getValue(), StringUtils.EMPTY);
			Paper paperByScholarId = paperRepository.findPaperByScholarId(line);
			if(paperByScholarId != null) {
				paper.setId(paperByScholarId.getId());
			}
			paper.setScholarId(line);
//			System.out.println("INDEX: " + line);
			
		} else if (line.startsWith(CNDLinePrefix.REFERENCE.getValue())) {
			line = line.replace(CNDLinePrefix.REFERENCE.getValue(), StringUtils.EMPTY);
			handleCitationRelations(paper, line);
//			System.out.println("REFERENCE: " + line);
		} 
		
	}

	private void handleCitationRelations(Paper paper, String line) {
		if(paper.getScholarId().equals(line)) {
			return;
		}
		
		Paper citation = paperRepository.findPaperByScholarId(line);
		if (citation == null) {
			citation = new Paper();
			citation.setScholarId(line);
			citation = paperRepository.saveAndFlush(citation);
		}
		paper.getCitations().add(citation);
	}

	private void handleAuthorRelations(Paper paper, String line) {
		String[] authors = line.split(",");
		for (String authorName : authors) {
			Author author = authorRepository.findAuthorByName(authorName);
			if (author == null) {
				author = new Author();
				author.setName(authorName);
				author = authorRepository.saveAndFlush(author);
			}
			paper.getAuthors().add(author);
		}
	}
	
}

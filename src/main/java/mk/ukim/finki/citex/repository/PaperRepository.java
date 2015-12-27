package mk.ukim.finki.citex.repository;

import mk.ukim.finki.citex.model.Paper;

public interface PaperRepository extends JpaSpecificationRepository<Paper> {

	Paper findPaperByScholarId(String scholarId);
	
}

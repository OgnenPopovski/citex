package mk.ukim.finki.citex.service.util;

public enum CNDLinePrefix {
	
	PAPER_TITLE("#*"),
	AUTHORS("#@"),
	YEAR("#t"),
	PUBLICATION_VENUE("#c"),
	INDEX("#index"),
	REFERENCE("#%"),
	ABSTRACT("#!");
	
	private final String value;
	
	private CNDLinePrefix (String value) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
}

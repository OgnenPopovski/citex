package mk.ukim.finki.citex.data.generate;

import java.util.List;
import java.util.Set;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import mk.ukim.finki.citex.model.Author;

public class CitexStaticDataImport {

	public static void main(String[] args) {
		
		Set<Author> authors = Sets.newHashSet();
		Author a1 = new Author();
		a1.setName("a1");
		authors.add(a1);
		
		Author a2 = new Author();
		a2.setName("a2");
		authors.add(a2);
		
		Author a3 = new Author();
		a3.setName("a3");
		authors.add(a3);
		
		Author a4 = new Author();
		a4.setName("a4");
		authors.add(a4);
		
		Author a5 = new Author();
		a5.setName("a5");
		authors.add(a5);
		
		authors.forEach(System.out::println);
		List<Author> authorList = Lists.newArrayList(authors);
		authorList.forEach(System.out::println);
	}
	
}

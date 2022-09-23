import collections.models.Reference;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Scanner;

public class SongBookMain {

    public static void main(String[] args) {

        Path path = Paths.get("backend\\src\\main\\java\\collections\\source-files");
        SongCollectionService collectionService = new SongCollectionService(path, "TheDailyUkulele");
/*
        System.out.println("\n" + collectionService.getSingleLine(108));
        System.out.println("\nTotal number of songs listed: " + collectionService.getLength());
*/
        collectionService.addCollection(path, "Liederbuecher_a");
        collectionService.addCollection(path, "Liederbuecher_b");

        collectionService.addCollection(path, "serviceTest_EmptyFile");

/*
        System.out.println("\n" + collectionService.getSingleLine(731));
        System.out.println("\nTotal number of songs listed: " + collectionService.getLength());
*/
        System.out.print("\nBitte gib ein Suchwort ein: ");
        String searchWord = new Scanner(System.in).nextLine();
        List<Reference> result = collectionService.getReferenceBySearchWord(searchWord);

        for (Reference reference : result) {
            if (reference.page > 0) {
                System.out.println(reference.title + ", " + reference.volume + ", " + reference.page);
            } else {
                System.out.println(reference.title + ", " + reference.volume);
            }
        }

        if (result.size() == 0) {
            System.out.println("\nEs wurde kein Titel mit diesem Suchwort gefunden.");
        }
    }
}

package songbook;

import songbook.collections.ReferencesService;
import songbook.collections.models.Reference;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Scanner;

public class SongBookMain {

    public static void main(String[] args) {

/*        Path path = Paths.get("backend\\src\\main\\java\\songbook\\collections\\source-files");
        ReferencesService collectionService = new ReferencesService(path, "TheDailyUkulele");

        collectionService.addCollection(path, "Liederbuecher_a");
        collectionService.addCollection(path, "Liederbuecher_b");

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

 */
    }
}
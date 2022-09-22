import models.Reference;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class SongCollectionMain {

    public static void main(String[] args) {

        Path path = Paths.get("backend\\src\\main\\java\\source-files");
        SongCollectionService collectionService = new SongCollectionService(path, "TheDailyUkulele");
/*
        System.out.println("\n" + collectionService.getSingleLine(108));
        System.out.println("\nTotal number of songs listed: " + collectionService.getLength());
*/
        collectionService.addCollection(path, "Liederbuecher_a");
/*
        System.out.println("\n" + collectionService.getSingleLine(731));
        System.out.println("\nTotal number of songs listed: " + collectionService.getLength());
*/

        List<Reference> result = collectionService.getReferenceBySearchWord("blowin");
        for (Reference reference : result) {
            if (reference.page > 0) {
                System.out.println(reference.title + ", " + reference.volume + ", " + reference.page);
            } else {
                System.out.println(reference.title + ", " + reference.volume);
            }
        }
    }

}

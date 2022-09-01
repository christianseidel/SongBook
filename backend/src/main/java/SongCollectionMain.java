import java.nio.file.Path;
import java.nio.file.Paths;

public class SongCollectionMain {

    public static void main(String[] args) {

        Path path = Paths.get("backend\\src\\main\\java\\source-files");
        SongCollectionService songCollection = new SongCollectionService(path);

        System.out.println("\n" + songCollection.getSingleLine(108));
        System.out.println("\nTotal number of songs listed: " + songCollection.getLength());

        songCollection.addCollection(path, "Liederbuecher");

        System.out.println("\n" + songCollection.getSingleLine(731));
        System.out.println("\nTotal number of songs listed: " + songCollection.getLength());

    }

}

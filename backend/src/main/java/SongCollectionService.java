import java.nio.file.Path;

public class SongCollectionService {

    private final SongCollection collection;

    public SongCollectionService(Path path) {
        this.collection = new SongCollection(path, "TheDailyUkulele");
    }

    public String getSingleLine(int index) {
        return collection.getSingleLine(index);
    }

    public void addSingleLine(String line) {
        collection.addSingleLine(line);
    }

    public int getLength() {
        return collection.getLength();
    }

    public void addCollection(Path path, String nextFile) {
        SongCollection additionalCollection = new SongCollection(path, nextFile);
        for (int i = 0; i < additionalCollection.getLength(); i++) {
            String next = additionalCollection.getSingleLine(i);
            collection.addSingleLine(next);
        }
    }

    public String findTitle(String string) {
        collection.findTitle(string);
        String title = "noch nicht";

        return title;
    }
}

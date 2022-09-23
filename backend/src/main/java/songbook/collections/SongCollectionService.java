package songbook.collections;

import songbook.collections.models.Reference;

import java.nio.file.Path;
import java.util.List;

public class SongCollectionService {

    private final SongCollection collection;

    public SongCollectionService(Path path, String fileName) {
        this.collection = new SongCollection(path, fileName);
    }

    public Reference getReferenceByIndex(int index) {
        return collection.getReferenceByIndex(index);
    }

    public void addSingleReference(String song) {
        collection.addSingleReference(song);
    }

    public void addSingleReference(String song, short page) {
        collection.addSingleReference(song, page);
    }

    public void addSingleReference(Reference item) {
        collection.addSingleReference(item);
    }

    public int getLength() {
        return collection.getLength();
    }

    public void addCollection(Path path, String fileName) {
        SongCollection additionalCollection = new SongCollection(path, fileName);
        for (short i = 0; i < additionalCollection.getLength(); i++) {
            Reference item = additionalCollection.getReferenceByIndex(i);
            collection.addSingleReference(item);
        }
    }

    public List<Reference> getReferenceBySearchWord(String string) {
        return collection.getReferenceBySearchWord(string);
    }
}

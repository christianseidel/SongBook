package songbook.collections;

import org.springframework.stereotype.Service;
import songbook.collections.models.Reference;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ReferencesService {

    private final ReferencesRepository referencesRepository;

    public ReferencesService(ReferencesRepository referencesRepository) {
        this.referencesRepository = referencesRepository;
    }

    public Reference createReference(Reference reference) {
        return referencesRepository.save(reference);
    }


//  IMPORT ONE SONG COLLECTION //

    public void importSongCollection() {
        String basePath = new File("").getAbsolutePath();
        System.out.println(basePath);

        Path path = Paths.get("backend\\src\\main\\java\\songbook\\collections\\source-files");
        String fileName = "serviceTest_twoPerfectLines";

        SongCollection additionalCollection = new SongCollection(path, fileName);
        for (short i = 0; i < additionalCollection.getLength(); i++) {
            Reference item = additionalCollection.getReferenceByIndex(i);
            referencesRepository.save(item);
        }
    }



/*    public SongCollectionService(Path path, String fileName) {
        this.songRepository = new SongCollection(path, fileName);
    }

    public Reference getReferenceByIndex(int index) {
        return songRepository.getReferenceByIndex(index);
    }

    public void addSingleReference(String song) {
        songRepository.addSingleReference(song);
    }

    public void addSingleReference(String song, short page) {
        songRepository.addSingleReference(song, page);
    }

    public void addSingleReference(Reference item) {
        songRepository.addSingleReference(item);
    }

    public int getLength() {
        return songRepository.getLength();
    }



    public List<Reference> getReferenceBySearchWord(String string) {
        return songRepository.getReferenceBySearchWord(string);
    }

 */
}

package songbook.collections;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.models.Reference;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class SongCollectionService {

    private final ReferencesRepository referencesRepository;

    public SongCollectionService(ReferencesRepository referencesRepository) {
        this.referencesRepository = referencesRepository;
    }

    public void processMultipartFile(MultipartFile file) throws IOException {


        Path basis = Paths.get("backend\\src\\main\\java\\songbook\\collections");


        Path temporaryDirectory = basis.resolve("source-files\\temporary");

        try {
            Files.createDirectory(temporaryDirectory);
            System.out.println("Directory created.");
        } catch (IOException e) {
            System.out.println("Could not create temporary directory.");
        }

        String basePath = new File("").getAbsolutePath();

        String basisString = basis.toString();
        String path = basePath + "\\" + basisString + "\\source-files\\temporary\\" + file.getOriginalFilename();

        System.out.println(path);
        File storedSongCollection = new File(path);

        // storedSongCollection.createNewFile();
        // >>>>>>>>>>> THIS IS THE CORRECT PATH!!!!!!!!!
        // file.transferTo(storedSongCollection);

        /*
        Source:
        https://www.youtube.com/watch?v=OTyY9a6gd6Y
        and:
        https://github.com/serlesen/backend-social-network/blob/f809c27cb14d8c9e6be49d28199549d7cafc21e7/src/main/java/com/sergio/socialnetwork/services/CommunityService.java#L95


         */


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

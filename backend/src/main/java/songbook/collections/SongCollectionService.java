package songbook.collections;

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

    public String processMultipartFile(MultipartFile file) throws IOException {

        // get my root
        String rootDirWithSlash = SongCollectionService.class.getResource("/").getPath();
        String rootDir = rootDirWithSlash.substring(1);
        System.out.println("-> Root dir: \"" + rootDir + "\"");

        Path rootPath = Paths.get(rootDir);
        Path tempPath = rootPath.resolve("temporary");

        try {
            Files.createDirectory(tempPath);
            System.out.println("-> Directory created.");
        } catch (IOException e) {
            System.out.println("Could not create temporary directory!");
            throw new RuntimeException("The server could not create the temporary directory needed.");
        }

        String basePath = new File("").getAbsolutePath();
        String pathBasisToString = rootPath.toString();

        String fileLocation = rootDir + "\\temporary\\" + file.getOriginalFilename();

        File storedSongCollection = new File(fileLocation);
        file.transferTo(storedSongCollection);
        System.out.println("-> File created: " + file.getOriginalFilename());

        /*
        Source:
        https://www.youtube.com/watch?v=OTyY9a6gd6Y
        and:
        https://github.com/serlesen/backend-social-network/blob/f809c27cb14d8c9e6be49d28199549d7cafc21e7/src/main/java/com/sergio/socialnetwork/services/CommunityService.java#L95


         */
        try {
            Files.delete(Paths.get(fileLocation));
        } catch (IOException e) {
            System.out.println("Could not delete file" + storedSongCollection.getName() + ".");
            throw  new RuntimeException("File \"" + storedSongCollection.getName() + "\" could not be deleted.");
        }
        try {
            Files.delete(tempPath);
            System.out.println("-> Directory: \"" + tempPath + "\" deleted.");
        } catch (IOException e) {
            System.out.println("Could not delete temporary directory.");
        }

        String feedback = "Es wurden alle 300 von 300 Einträgen eingelesen.";
        return feedback;
    }


    public Reference createReference(Reference reference) {
        return referencesRepository.save(reference);
    }



//  IMPORT ONE SONG COLLECTION //

    public void importSongCollection(Path filePath) {
        String basePath = new File("").getAbsolutePath();
        System.out.println(basePath);

        Path path = Paths.get("backend\\src\\main\\java\\songbook\\collections\\source-files");
        String fileName = "serviceTest_twoPerfectLines";

        SongCollection additionalCollection = new SongCollection(filePath, fileName);
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

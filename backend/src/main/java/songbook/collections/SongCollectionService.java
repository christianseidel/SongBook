package songbook.collections;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.models.Reference;
import songbook.collections.models.SongCollection;
import songbook.collections.models.ReferencesDTO;
import songbook.exceptions.*;

import java.io.File;
import java.io.IOException;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static songbook.collections.models.SongCollection.*;

@Service
public class SongCollectionService {

    private final ReferencesRepository referencesRepository;
    // In order to make all methods testable, this following variable is introduced.
    @Value("${server.context-path}")
    private String rootDirectory;

    public SongCollectionService(ReferencesRepository referencesRepository) {
        this.referencesRepository = referencesRepository;
    }

    public ReferencesDTO getAllReferences(String user) {
        List<Reference> list = referencesRepository.findAll().stream()
                .filter(e -> e.getUser().equals(user))
                .filter(e -> !e.isHidden())
                .sorted(Comparator.comparing(Reference::getTitle))
                .toList();
        return new ReferencesDTO(list);
    }

    public ReferencesDTO getReferencesByTitle(String title, String user) {
        List<Reference> list = referencesRepository.findAll().stream()
                .filter(e -> e.getUser().equals(user))
                .filter(e -> !e.isHidden())
                .filter(element -> element.getTitle().toLowerCase().contains(title.toLowerCase()))
                .sorted(Comparator.comparing(Reference::getTitle))
                .toList();
        return new ReferencesDTO(list);
    }

    public Reference createReference(Reference reference) {
        return referencesRepository.save(reference);
    }

    public ReferencesDTO getReferenceById(String id) {
        return new ReferencesDTO(List.of(referencesRepository.findById(id)
                .orElseThrow(NoSuchIdException::new)));
    }

    public void deleteReference(String id) {
       referencesRepository.findById(id)
               .ifPresentOrElse(e -> referencesRepository.deleteById(e.getId()),
                        () -> {throw new NoSuchIdException();});
    }

    public Reference editReference(String id, Reference reference) {
        return referencesRepository.findById(id)
                    .map(e -> referencesRepository.save(reference))
                    .orElseThrow(NoSuchIdException::new);
    }

    public void hideReference (String id) {
        Reference reference = referencesRepository.findById(id).orElseThrow(NoSuchIdException::new);
        reference.setHidden(true);
        referencesRepository.save(reference);
    }

    public void unhideReference (String id) {
        Reference reference = referencesRepository.findById(id).orElseThrow(NoSuchIdException::new);
        reference.setHidden(false);
        referencesRepository.save(reference);
    }

    public ReferencesDTO copyReferenceById(String id) {
        ArrayList<Reference> list = new ArrayList<>();
        Optional<Reference> originalRef = referencesRepository.findById(id);
        originalRef.ifPresent((item)  -> {
            Reference copiedItem = referencesRepository.save(new Reference(item));
            list.add(copiedItem);
        });
        return new ReferencesDTO(list);
    }

    public CollectionUploadResponse processCollectionUpload(MultipartFile file, String user) throws IOException {

        Path tempDir = Path.of(rootDirectory, "temporary");

        try {
            Files.createDirectory(tempDir);
        } catch (IOException e) {
            throw new RuntimeException("The server could not create the temporary directory needed.");
        }

        // save file
        String fileLocation = tempDir + File.separator + file.getOriginalFilename();
        File storedSongCollection = new File(fileLocation);
        file.transferTo(storedSongCollection);

        // process new SongCollection
        CollectionUploadResponse collectionUploadResponse;
        try {
            collectionUploadResponse = importNewSongCollection(storedSongCollection.toPath(), user);
        } catch (MalformedFileException e) {
            deleteFileAndTempDir(fileLocation);
            throw e;
        }

        // undo file and directory
        deleteFileAndTempDir(fileLocation);

        return collectionUploadResponse;
    }

    private CollectionUploadResponse importNewSongCollection(Path filePath, String user) {
        CollectionUploadResponse collectionUploadResponse = new CollectionUploadResponse();
        List<String> listOfItems = readListOfReferences(filePath);
        for (String line : listOfItems) {
            collectionUploadResponse.setTotalNumberOfReferences(collectionUploadResponse.getTotalNumberOfReferences() + 1); // will serve as check sum
            String[] elements = line.split(";");
            SongCollection songCollection;
            // check song collection
            try {
                songCollection = mapSongCollection(elements[1]);
            } catch (IllegalSongCollectionException e) {
                collectionUploadResponse.addLineWithInvalidCollectionName(line);
                collectionUploadResponse.setNumberOfReferencesRejected(collectionUploadResponse.getNumberOfReferencesRejected() + 1);
                continue;
            } catch (IndexOutOfBoundsException e) {
                collectionUploadResponse.addLineWithInvalidCollectionName(elements[0] + " // song collection information missing ");
                collectionUploadResponse.setNumberOfReferencesRejected(collectionUploadResponse.getNumberOfReferencesRejected() + 1);
                continue;
            }
            // create reference
            Reference item = new Reference(elements[0], songCollection);
            item.setUser(user);
            // check for double
            if (!checkIfReferenceExists(item.getTitle(), item.getSongCollection(), user)) {
                // set page
                if (elements.length > 2) {
                    try {
                        item.setPage(Integer.parseInt(elements[2].trim()));
                    } catch (IllegalArgumentException e) {
                        collectionUploadResponse.addLineWithInvalidPageDatum(line);
                        collectionUploadResponse.setNumberOfReferencesRejected(collectionUploadResponse.getNumberOfReferencesRejected() + 1);
                        continue;
                    }
                }
                collectionUploadResponse.setNumberOfReferencesAccepted(collectionUploadResponse.getNumberOfReferencesAccepted() + 1);
                referencesRepository.save(item);
            } else {
                collectionUploadResponse.setNumberOfExistingReferences(collectionUploadResponse.getNumberOfExistingReferences() + 1);
                System.out.println("-- Already exists: " + line);
            }
        }
        return collectionUploadResponse;
    }

    private boolean checkIfReferenceExists(String title, SongCollection collection1, String user) {
        Collection<Reference> collection = referencesRepository.findAllByTitleAndSongCollectionAndUser(title, collection1, user);
        return !collection.isEmpty();
    }

    private List<String> readListOfReferences(Path path) throws RuntimeException {
        List<String> listOfReferences;
        try {
            listOfReferences = Files.readAllLines(path, StandardCharsets.UTF_8);
            if (listOfReferences.size() == 0) {
                Files.delete(path);
                Path parent = path.getParent();
                Files.delete(parent);
                throw new EmptyFileException(path.getFileName().toString());
            }
            return listOfReferences;
        } catch (NoSuchFileException e) {
            throw new FileNotFoundException(path.toString());
        } catch (MalformedInputException e) {
            throw new MalformedFileException(path.getFileName().toString());
        } catch (IOException e) {
            throw new UnableToLoadFileException();
        }
    }

    public void deleteFileAndTempDir(String fileLocation) {
        int end = fileLocation.lastIndexOf("/");
        String fileName = fileLocation.substring(end + 1);
        Path path = Paths.get(fileLocation);
        try {
            Files.delete(path);
        } catch (IOException e) {
            throw new RuntimeException("File \"" + fileName + "\" could not be deleted.");
        }
        Path parent = path.getParent();
        try {
            Files.delete(parent);
        } catch (IOException e) {
            System.out.println("Could not delete temporary directory.");
        }
    }

    private SongCollection mapSongCollection(String proposal) {
        String trimmedProposal = proposal.toLowerCase().trim();
        return switch (trimmedProposal) {
            case "the daily ukulele (yellow)" -> THE_DAILY_UKULELE_YELLOW;
            case "the daily ukulele (blue)" -> THE_DAILY_UKULELE_BLUE;
            case "liederbuch" -> LIEDERBUCH_1;
            case "liederkiste" -> LIEDERKISTE_2;
            case "liederkarren" -> LIEDERKARREN_3;
            case "liedercircus" -> LIEDERCIRCUS_4;
            case "liederkorb" -> LIEDERKORB_5;
            case "liederbaum" -> LIEDERBAUM_6;
            case "liederwolke" -> LIEDERWOLKE_7;
            case "liedersonne" -> LIEDERSONNE_8;
            case "liederstern" -> LIEDERSTERN_9;
            case "liederstrauss" -> LIEDERSTRAUSS_10;
            case "liederballon_11" -> LIEDERBALLON_11;
            case "liedergarten_12" -> LIEDERGARTEN_12;
            case "liederzug_13" -> LIEDERZUG_13;
            case "liederwelt_14" -> LIEDERWELT_14;
            case "liederfest_15" -> LIEDERFEST_15;
            case "frohe weihnachten" -> FROHE_WEIHNACHTEN;
            case "test collection #1" -> TEST_COLLECTION_1;
            case "test collection #2" -> TEST_COLLECTION_2;
            case "test collection #3" -> TEST_COLLECTION_3;
            default -> throw new IllegalSongCollectionException();
        };
    }

    public void setRootDirectory(String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }
}

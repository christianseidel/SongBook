package songbook.collections;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.exceptions.*;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferenceVolume;
import songbook.collections.models.ReferencesDTO;

import java.io.File;
import java.io.IOException;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static songbook.collections.models.ReferenceVolume.*;

@Service
@RequiredArgsConstructor
public class SongCollectionService {

    private final ReferencesRepository referencesRepository;

    public ReferencesDTO getAllReferences() {
        List<Reference> list = referencesRepository.findAll().stream()
                .sorted(Comparator.comparing(Reference::getTitle))
                .toList();
        return new ReferencesDTO(list);
    }

    public ReferencesDTO getReferencesByTitle(String title) {
        List<Reference> list = referencesRepository.findAll().stream()
                .filter(element -> element.getTitle().toLowerCase().contains(title.toLowerCase()))
                .sorted(Comparator.comparing(Reference::getTitle))
                .toList();
        return new ReferencesDTO(list);
    }

    public Reference createReference(Reference reference) {
        return referencesRepository.save(reference);
    }

    public ReferencesDTO getReferenceById(String id) {
        ArrayList<Reference> list = new ArrayList<>();
        referencesRepository.findById(id)
                .map(list::add)
                .orElseThrow(NoSuchIdException::new);
        return new ReferencesDTO(list);
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

    public ReferencesDTO copyReferenceById(String id) {
        ArrayList<Reference> list = new ArrayList<>();
        Optional<Reference> originalRef = referencesRepository.findById(id);
        originalRef.ifPresent((item)  -> {
            Reference copiedItem = referencesRepository.save(new Reference(item));
            list.add(copiedItem);
        });
        return new ReferencesDTO(list);
    }

    public UploadResult processMultipartFileUpload(MultipartFile file) throws IOException {

        // get my root
        String rootDirWithSlash = SongCollectionService.class.getResource("/").getPath();
        String rootDir = rootDirWithSlash.substring(1);
        System.out.println("-> Root dir: \"" + rootDir + "\"");

        // establish temp dir
        Path rootPath = Paths.get(rootDir);
        Path tempPath = rootPath.resolve("temporary");

        try {
            Files.createDirectory(tempPath);
            System.out.println("-> Directory created.");
        } catch (IOException e) {
            System.out.println("!  Could not create temporary directory!");
            throw new RuntimeException("Unfortunately, the server could not create the temporary directory needed.");
        }

        // save file
        String fileLocation = rootDir + "temporary/" + file.getOriginalFilename();
        File storedSongCollection = new File(fileLocation);
        file.transferTo(storedSongCollection);
        System.out.println("-> File created: " + file.getOriginalFilename());

        // process new SongCollection
        UploadResult uploadResult;
        try {
            uploadResult = importNewSongCollection(storedSongCollection.toPath());
        } catch (MalformedFileException e) {
            deleteTempDirAndFile(fileLocation, tempPath, storedSongCollection.getName());
            throw e;
        }

        // undo file and directory
        deleteTempDirAndFile(fileLocation, tempPath, storedSongCollection.getName());

        return uploadResult;
    }

    private UploadResult importNewSongCollection(Path filePath) {
        UploadResult uploadResult = new UploadResult();
        List<String> listOfItems = readListOfReferences(filePath);
        for (String line : listOfItems) {
            uploadResult.setTotalNumberOfReferences(uploadResult.getTotalNumberOfReferences() + 1); // will serve as check sum
            String[] elements = line.split(";");
            ReferenceVolume volume;
            // check volume
            try {
                volume = mapReferenceVolume(elements[1]);
            } catch (IllegalReferenceVolumeException e) {
                uploadResult.addLineWithInvalidVolumeDatum(line);
                uploadResult.setNumberOfReferencesRejected(uploadResult.getNumberOfReferencesRejected() + 1);
                continue;
            } catch (IndexOutOfBoundsException e) {
                uploadResult.addLineWithInvalidVolumeDatum(elements[0] + " // volume information missing ");
                uploadResult.setNumberOfReferencesRejected(uploadResult.getNumberOfReferencesRejected() + 1);
                continue;
            }
            // create reference
            Reference item = new Reference(elements[0], volume);
            // check for double
            if (!checkIfReferenceExists(item.getTitle(), item.getVolume())) {
                // set page
                if (elements.length > 2) {
                    try {
                        item.setPage(Integer.parseInt(elements[2].trim()));
                    } catch (IllegalArgumentException e) {
                        uploadResult.addLineWithInvalidPageDatum(line);
                        uploadResult.setNumberOfReferencesRejected(uploadResult.getNumberOfReferencesRejected() + 1);
                        continue;
                    }
                }
                uploadResult.setNumberOfReferencesAccepted(uploadResult.getNumberOfReferencesAccepted() + 1);
                referencesRepository.save(item);
            } else {
                uploadResult.setNumberOfExistingReferences(uploadResult.getNumberOfExistingReferences() + 1);
                System.out.println("-- Already exists: " + line);
            }
        }
        return uploadResult;
    }

    private boolean checkIfReferenceExists(String title, ReferenceVolume volume) {
        Collection<Reference> collection = referencesRepository.findAllByTitleAndVolume(title, volume);
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

    //public void deleteTempDirAndFile(String fileLocation, Path tempPath, String storedSongCollection) {
    public void deleteTempDirAndFile(String fileLocation, Path tempPath, String storedSongCollection) {
        int end = fileLocation.lastIndexOf("/");
        String fileName = fileLocation.substring(end + 1);
        System.out.println("fileName: " + fileName);
        System.out.println("file location: " + fileLocation);  //  D:/Ukulele/SongBook/backend/target/classes//temporary/0 oneTestSong.txt
        System.out.println("tempPath: " + tempPath);  // D:\Ukulele\SongBook\backend\target\classes\temporary
        System.out.println("storedSongCollection: " + storedSongCollection);  // 0 oneTestSong.txt
        Path path = Paths.get(fileLocation);
        try {
            Files.delete(path);
        } catch (IOException e) {
            System.out.println("! Could not delete file" + storedSongCollection + ".");
            throw new RuntimeException("! File \"" + storedSongCollection + "\" could not be deleted.");
        }
        Path parent = path.getParent();
        try {
            Files.delete(parent);
            System.out.println("-> Directory \"" + tempPath + "\" deleted.");
        } catch (IOException e) {
            System.out.println("! Could not delete temporary directory.");
        }
    }

    private ReferenceVolume mapReferenceVolume(String proposal) {
        String trimmedProposal = proposal.toLowerCase().trim();
        return switch (trimmedProposal) {
            case "the daily ukulele (yellow)" -> TheDailyUkulele_Yellow;
            case "the daily ukulele (blue)" -> TheDailyUkulele_Blue;
            case "liederbuch" -> Liederbuch_1;
            case "liederkiste" -> Liederkiste_2;
            case "liederkarren" -> Liederkarren_3;
            case "liedercircus" -> Liedercircus_4;
            case "liederkorb" -> Liederkorb_5;
            case "liederbaum" -> Liederbaum_6;
            case "liederwolke" -> Liederwolke_7;
            case "liedersonne" -> Liedersonne_8;
            case "liederstern" -> Liederstern_9;
            case "liederstrauss" -> Liederstrauss_10;
            case "liederballon_11" -> Liederballon_11;
            case "liedergarten_12" -> Liedergarten_12;
            case "liederzug_13" -> Liederzug_13;
            case "liederwelt_14" -> Liederwelt_14;
            case "liederfest_15" -> Liederfest_15;
            default -> throw new IllegalReferenceVolumeException();
        };
    }
}

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
                .filter(element -> element.title.toLowerCase().contains(title.toLowerCase()))
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
               .ifPresentOrElse(e -> referencesRepository.deleteById(e.id),
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
            list.add(new Reference(copiedItem));
        });
        return new ReferencesDTO(list);
    }

    public NewSongCollection processMultipartFileUpload(MultipartFile file) throws IOException {

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
            System.out.println("! Could not create temporary directory!");
            throw new RuntimeException("! The server could not create the temporary directory needed.");
        }

        // save file
        String fileLocation = rootDir + "\\temporary\\" + file.getOriginalFilename();
        File storedSongCollection = new File(fileLocation);
        file.transferTo(storedSongCollection);
        System.out.println("-> File created: " + file.getOriginalFilename());

        // process new SongCollection
        NewSongCollection newSongCollection;
        try {
            newSongCollection = importNewSongCollection(storedSongCollection.toPath());
        } catch (MalformedFileException e) {
            deleteTempDirAndFile(fileLocation, tempPath, storedSongCollection.getName());
            throw e;
        }

        // undo file and directory
        deleteTempDirAndFile(fileLocation, tempPath, storedSongCollection.getName());

        return newSongCollection;
    }

    public NewSongCollection importNewSongCollection(Path filePath) {
        NewSongCollection newSongCollection = new NewSongCollection();
        List<String> listOfItems = readListOfReferences(filePath);
        for (String line : listOfItems) {
            newSongCollection.totalNumberOfReferences++; // will later serve as check sum (yet ToDo)
            String[] elements = line.split(";");
            ReferenceVolume volume;
            // check next volume
            try {
                volume = mapReferenceVolume(elements[1]);
            } catch (IllegalReferenceVolumeException e) {
                newSongCollection.addIllegalVolumeToList(elements[1]);
                newSongCollection.numberOfReferencesRejected++;
                continue;
            }
            // create next reference
            Reference item = new Reference(elements[0], volume);
            // check for double
            if (!checkIfReferenceExists(item.title, item.volume)) {
                newSongCollection.numberOfReferencesAccepted++;
                referencesRepository.save(item);
                // set page
                if (elements.length > 2) {
                    try {
                        // TODO: Hier könnte es zu einem Fehler kommen...
                        item.page = Integer.parseInt(elements[2].trim());
                    } catch (IllegalArgumentException e) {
                        newSongCollection.addIllegalPageToList(elements[2]);
                        newSongCollection.numberOfReferencesRejected++;
                        referencesRepository.delete(item);
                    }
                } else {
                    newSongCollection.numberOfReferencesRejected++;
                }
            }

        }
        return newSongCollection;
    }

    private boolean checkIfReferenceExists(String title, ReferenceVolume volume) {
        Collection<Reference> collection = referencesRepository.findAllByTitleAndVolume(title, volume);
        return !collection.isEmpty();
    }

    private List<String> readListOfReferences(Path path) throws FileNotFoundException {
        List<String> listOfReferences;
        try {
            listOfReferences = Files.readAllLines(path, StandardCharsets.UTF_8);
            if (listOfReferences.size() == 1 && listOfReferences.get(0).length() == 1) {
                throw new EmptyFileException(path.toString());
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

    public void deleteTempDirAndFile(String fileLocation, Path tempPath, String storedSongCollection) {
        try {
            Files.delete(Paths.get(fileLocation));
        } catch (IOException e) {
            System.out.println("! Could not delete file" + storedSongCollection + ".");
            throw new RuntimeException("! File \"" + storedSongCollection + "\" could not be deleted.");
        }
        try {
            Files.delete(tempPath);
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
            default -> throw new IllegalReferenceVolumeException(proposal.trim());
        };
    }
}

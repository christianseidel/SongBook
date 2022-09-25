package songbook.collections;

import songbook.collections.exceptions.*;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferenceVolume;

import java.io.IOException;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static songbook.collections.models.ReferenceVolume.*;

public class SongCollection {

    private final ArrayList<Reference> songCollection;
    public SongCollection(Path path, String fileName) {
        List<String> listOfSongs = importList(path, fileName);
        ArrayList<Reference> collection = new ArrayList<>();

        for (String line : listOfSongs) {
            String[] elements = line.split(";");
            Reference item = new Reference(elements[0]);
            try {
                item.volume = mapReferenceVolume(elements[1]);
            } catch (IllegalReferenceVolumeException e) {
                throw e;
            }
            if (elements.length > 2) {
                try {
                    item.page = Short.parseShort(elements[2].trim());
                } catch (IllegalArgumentException e) {
                    throw new IllegalPageFormatException(elements[2], fileName);
                }
            }
            collection.add(item);
        }
        this.songCollection = collection;
    }

    public Reference getReferenceByIndex(int index) {
        return songCollection.get(index);
    }
    public void addSingleReference(String title) {
        songCollection.add(new Reference(title));
    }
    public void addSingleReference(String title, short page) {
        songCollection.add(new Reference(title, page));
    }

    public void addSingleReference(Reference item) {
        songCollection.add(item);
    }
    public int getLength() {
        return songCollection.size();
    }
    public List<Reference> getReferenceBySearchWord(String string) {
        return songCollection.stream()
                .filter(element -> element.title.toLowerCase()
                        .contains(string.toLowerCase()))
                .toList();
    }
    private List<String> importList(Path path, String fileName) throws FileNotFoundException {
        Path finalPath = Paths.get(path + "\\" + fileName + "_import.txt");
        List<String> listOfSongs = List.of();
        try {
            listOfSongs = Files.readAllLines(finalPath, StandardCharsets.UTF_16BE);
            if (listOfSongs.size() == 1 && listOfSongs.get(0).length() == 1) {
                throw new EmptyFileException(fileName);
            }
            return listOfSongs;
        } catch (NoSuchFileException e) {
            throw new FileNotFoundException(fileName);
        } catch (MalformedInputException e) {
            throw new MalformedFileException(fileName);
        } catch (IOException e) {
            throw new UnableToLoadFileException();
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



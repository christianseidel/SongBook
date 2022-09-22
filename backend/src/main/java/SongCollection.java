import models.Reference;
import models.ReferenceVolume;

import java.io.IOException;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static models.ReferenceVolume.*;

public class SongCollection {

    private ArrayList<Reference> songCollection;

    public SongCollection(Path path, String fileName) {
        List<String> listOfSongs = importList(path, fileName);
        ArrayList<Reference> collection = new ArrayList<>();

        for (String line : listOfSongs) {
            String[] elements = line.split(";");
            Reference item = new Reference(elements[0]);
            try {
                item.volume = mapReferenceVolume(elements[1]);
            } catch (IllegalArgumentException e) {
                System.err.println(e.getClass().getSimpleName() + ": " + e.getMessage());
            }
            if (elements.length > 2) {
                try {
                    item.page = Short.parseShort(elements[2].trim());
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Die Zeichenfolge \""
                            + elements[2] + "\" in der Liedersammlung \""
                            + fileName + "\" ist keine gültige Seitenangabe.");
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

    private List<String> importList(Path path, String fileName) {
        Path finalPath = Paths.get(path + "\\" + fileName + "_import.txt");
        List<String> listOfSongs = List.of();
        try {
            listOfSongs = Files.readAllLines(finalPath, StandardCharsets.UTF_16BE);
            return listOfSongs;
        } catch (NoSuchFileException e) {
            System.err.println(e.getClass().getSimpleName() + ": Die Datei wurde nicht gefunden.");
        } catch (MalformedInputException e) {
            System.err.println(e.getClass().getSimpleName() + ": Die Datei \"" + fileName + "\" wurde gefunden, kann aber nicht gelesen werden. Stellen Sie sicher, dass sie in der Codierung \"UTF-16 BE\" gespeichert wurde.");
        } catch (IOException e) {
            System.err.println(e.getClass().getSimpleName() + ": Die Datei konnte nicht geladen werden.");
        }
        return listOfSongs;
        // Todo:
        // What happens if file is empty?
    }

    private ReferenceVolume mapReferenceVolume(String propsal) throws IllegalArgumentException {
        propsal = propsal.toLowerCase().trim();
        return switch (propsal) {
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
            case "liederballon" -> Liederballon_11;
            case "liedergarten" -> Liedergarten_12;
            case "liederzug" -> Liederzug_13;
            case "liederwelt" -> Liederwelt_14;
            case "liederfest" -> Liederfest_15;
            default -> throw new IllegalArgumentException("Die Liedersammlung \""
                    + propsal + "\" ist nicht bekannt.");
        };
    }
}



import java.io.IOException;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

public class SongCollection {

    private List<String> songCollection;

    public SongCollection(Path path, String fileName) {
        Path finalPath = Paths.get(path + "\\" + fileName + "_import.txt");

        try {
            this.songCollection = Files.readAllLines(finalPath, StandardCharsets.UTF_16BE);
        } catch (NoSuchFileException e) {
            System.err.println(e.getClass().getSimpleName() + ": Die Datei wurde nicht gefunden.");
        } catch (MalformedInputException e) {
            System.err.println(e.getClass().getSimpleName() + ": Die Datei wurde gefunden, kann aber nicht gelesen werden.");
        } catch (IOException e) {
            System.err.println(e.getClass().getSimpleName() + ": Die Datei konnte nicht geladen werden.");
        }
    }

    public String getSingleLine(int index) {
        return songCollection.get(index);
    }

    public void addSingleLine(String line) {
        songCollection.add(line);
    }

    public int getLength() {
        return songCollection.size();
    }

    public String findTitle(String string) {

        List<String> result = songCollection.stream()
                .filter(element -> element.toLowerCase().contains(string.toLowerCase()))
                .toList();

        for (String s : result) {
            System.out.println(s);
        }

        return "fertig";
    }

}

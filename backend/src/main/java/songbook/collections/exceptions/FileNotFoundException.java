package songbook.collections.exceptions;

public class FileNotFoundException extends RuntimeException {

    public FileNotFoundException(String file) {
        super ("Die Datei \"" + file + "\" wurde nicht gefunden.");
    }

}

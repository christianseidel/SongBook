package collections.exceptions;

public class EmptyFileException extends RuntimeException {

    public EmptyFileException(String file) {
        super("Die Datei \"" + file + "\" ist leer.");
    }
}

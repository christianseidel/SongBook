package collections.exceptions;

public class UnableToLoadFileException extends RuntimeException {

    public UnableToLoadFileException() {
        super("Die Datei konnte nicht geladen werden.");
    }
}

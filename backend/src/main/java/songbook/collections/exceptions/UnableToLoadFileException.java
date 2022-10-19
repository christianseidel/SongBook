package songbook.collections.exceptions;

public class UnableToLoadFileException extends RuntimeException {

    public UnableToLoadFileException() {
        super("The server was unable to load the file.");
    }
}

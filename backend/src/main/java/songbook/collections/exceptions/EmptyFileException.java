package songbook.collections.exceptions;

public class EmptyFileException extends RuntimeException {

    public EmptyFileException(String file) {
        super("The file '" + file + "' is empty; there are no references to process.");
    }
}

package songbook.collections.exceptions;

public class EmptyFileException extends RuntimeException {

    public EmptyFileException(String file) {
        super("The file '" + file + "' is an empty file. There are no references to process.");
    }
}

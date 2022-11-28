package songbook.collections.exceptions;

public class MalformedFileException extends RuntimeException {

    public MalformedFileException(String file) {
        super("Unable to process your file '" + file + "'. " +
                "Please, check whether it was correctly saved in 'UTF-8' encoding.");
    }
}

package songbook.exceptions;

public class NoSuchIdException extends IllegalStateException {
    // used to be RuntimeException

    public NoSuchIdException() {
        super("Server is unable to find your reference's ID.");
    }
}

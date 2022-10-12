package songbook.collections.exceptions;

public class NoSuchIdException extends RuntimeException {

    public NoSuchIdException() {
        super("Server is unable to find your reference's ID.");
    }
}

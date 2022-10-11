package songbook.collections.exceptions;

public class IdNotFoundException extends RuntimeException {

    public IdNotFoundException() {
        super("Server is unable to find your reference's ID.");
    }
}

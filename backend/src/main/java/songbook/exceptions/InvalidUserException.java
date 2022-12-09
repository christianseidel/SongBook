package songbook.exceptions;

public class InvalidUserException extends IllegalStateException {

    public InvalidUserException() {
        super("You do not have access to this item.");
    }
}

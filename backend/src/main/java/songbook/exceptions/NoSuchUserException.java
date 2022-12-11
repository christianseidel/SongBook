package songbook.exceptions;

public class NoSuchUserException extends IllegalStateException {

    public NoSuchUserException() {
        super("Server is unable to find this username.");
    }
}

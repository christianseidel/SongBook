package songbook.exceptions;

public class UserAlreadyExistsException extends IllegalStateException {

    public UserAlreadyExistsException() {
        super("Chosen user name already exists.");
    }
}

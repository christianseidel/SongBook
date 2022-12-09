package songbook.exceptions;

public class UserAlreadyExistsException extends IllegalStateException {

    public UserAlreadyExistsException() {
        super("The user name you choose already exists.");
    }
}

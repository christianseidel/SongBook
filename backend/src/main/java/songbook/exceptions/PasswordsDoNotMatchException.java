package songbook.exceptions;

public class PasswordsDoNotMatchException extends IllegalStateException {

    public PasswordsDoNotMatchException() {
        super("Passwords do not match.");
    }
}

package songbook.collections.exceptions;

public class SongAlreadyExistsException extends RuntimeException {

        public SongAlreadyExistsException(String title) {
            super("The song '" + title + "' already exists.");
        }
    }




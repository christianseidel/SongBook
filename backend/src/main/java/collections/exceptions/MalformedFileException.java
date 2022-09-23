package collections.exceptions;

public class MalformedFileException extends RuntimeException {

    public MalformedFileException(String file) {
        super("Die Datei \"" + file + "\" wurde gefunden,\n\tkann aber " +
                "nicht gelesen werden. Stellen Sie sicher, dass sie in " +
                "der Codierung \"UTF-16 BE\" gespeichert wurde!");
    }
}

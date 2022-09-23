package songbook.collections.exceptions;

public class IllegalReferenceVolumeException extends IllegalArgumentException {

    public IllegalReferenceVolumeException(String name) {
        super ("Die Liedersammlung \"" + name + "\" ist nicht bekannt.");
    }
}

package collections.exceptions;

public class IllegalPageFormatException extends NumberFormatException {

    public IllegalPageFormatException(String error, String fileName) {
        super ("Die Zeichenfolge \"" + error
                + "\" in der Liedersammlung \"" + fileName
                + "\" ist keine gültige Seitenangabe.");
    }
}

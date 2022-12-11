package songbook.exceptions;

public class ErrorMessage {
    public static String jsonify(String text) {
        return "{\"message\": \"" + text + "\"}";
    }
}

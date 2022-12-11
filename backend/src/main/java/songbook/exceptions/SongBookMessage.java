package songbook.exceptions;

public class SongBookMessage {
    public static String jsonify(String text) {
        return "{\"message\": \"" + text + "\"}";
    }
}

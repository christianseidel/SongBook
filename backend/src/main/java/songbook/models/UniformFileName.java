package songbook.models;
import java.util.Random;

public class UniformFileName {

    // This Method will bring any File Name into the following format:
    // "ThisIsMyFileNameWhenUploading.pdf"
    // => "uBP-453-qxd-ThisIsMyFileNam.pdf"
    // where the three leading triplets are made off random characters.

    public static String create(String name) {
        String[] trimmedFileName = trimFileNameAndSliceOffExtension(name);
        return getRandomLetterTriplet() + "-"
                + getRandomNumberTriplet() + "-"
                + getRandomLetterTriplet() + "-"
                + trimmedFileName[0] + trimmedFileName[1];
    }

    private static String[] trimFileNameAndSliceOffExtension(String name) {
        String fileExtension;
        if (name.lastIndexOf(".") == name.length() - 4) {
            fileExtension = name.substring(name.length() - 4);
            name = name.substring(0, name.length() -4);
        } else {
            throw new RuntimeException(("This file does not have a three-digit file extension!"));
        }
        return new String[]{name.substring(0, Math.min(name.length(), 15)), fileExtension};
    }

    private static final String[] LETTERS = {"a", "b", "c", "d", "e", "f", "g", "h",
            "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
            "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
            "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};

    private static String getRandomNumberTriplet() {
        Random rand = new Random();
        return (rand.nextInt(10)
                + String.valueOf(rand.nextInt(10))
                + rand.nextInt(10));
    }

    private static String getRandomLetterTriplet() {
        Random rand = new Random();
        return LETTERS[rand.nextInt(LETTERS.length)]
                + LETTERS[rand.nextInt(LETTERS.length)]
                + LETTERS[rand.nextInt(LETTERS.length)];
    }
}

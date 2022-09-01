import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SongCollectionServiceTest {

    SongCollectionService service;
    Path path = Paths.get("src\\main\\java\\source-files");

    @BeforeEach
    public void initEach() {
        this.service = new SongCollectionService(path);
    }

    private final ByteArrayOutputStream out = new ByteArrayOutputStream();
    private final ByteArrayOutputStream err = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;
    private final PrintStream originalErr = System.err;

    @BeforeEach
    public void setStreams() {
        System.setOut(new PrintStream(out));
        System.setErr(new PrintStream(err));
    }

    @Test
    void shouldReturnSongTitle() {
        String title = service.getSingleLine(108);
        assertEquals("Can't Help Falling In Love; The Daily Ukulele (Yellow)", title);
    }

    @Test
    void shouldAddOneTitle() {
        String newTitle = "Never to be Heard Song; The Daily Ukulele (Yellow)";
        int collectionLength = service.getLength();
        service.addSingleLine(newTitle);
        assertEquals(collectionLength + 1, service.getLength());

        String lastLine = service.getSingleLine(collectionLength);
        assertEquals(newTitle, lastLine);
    }

    @Test
    void shouldAddAnotherCollection() {
        int collectionLength = service.getLength();
        service.addCollection(path, "Liederbuecher");

        assertEquals(collectionLength + 1374, service.getLength());

        String actual = service.getSingleLine(collectionLength + 1);
        assertEquals("A Hard Rain's A Gonna Fall; (9); 80", actual);
        assertEquals("Zündschnüre-Song; (8); 67", service.getSingleLine(collectionLength + 1373));
    }

    @Test
    void shouldCreateNoSuchFileException() {
        new SongCollection(path, "gehtGarNicht");
        String result = err.toString();
        assertEquals("NoSuchFileException: Die Datei wurde nicht gefunden.\r\n", result);
    }

    @AfterEach
    public void restoreInitialStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
    }
}
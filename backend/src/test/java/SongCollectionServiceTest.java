import collections.SongCollection;
import collections.SongCollectionService;
import collections.exceptions.IllegalPageFormatException;
import collections.exceptions.IllegalReferenceVolumeException;
import collections.models.Reference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SongCollectionServiceTest {

    SongCollectionService service;
    Path path = Paths.get("src\\main\\java\\collections\\source-files");

    @BeforeEach
    public void initEach() {
        this.service = new SongCollectionService(path, "TheDailyUkulele");
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
    void shouldReturnSongTitleFoundByIndex() {
        Reference reference = service.getReferenceByIndex(108);
        assertEquals("Can't Help Falling In Love; TheDailyUkulele_Yellow", reference.title + "; " + reference.volume);
    }

    @Test
    void shouldReturnSongTitleFoundBySearchWord() {
        List<Reference> listReturned = service.getReferenceBySearchWord("moon ri");
        String actual = listReturned.get(0).title;
        assertEquals("Moon River", actual);
    }

    @Test
    void shouldAddOneTitle() {
        Reference myReference = new Reference("Never to be Heard Song; The Daily Ukulele (Green)");
        int collectionLength = service.getLength();
        service.addSingleReference(myReference);
        assertEquals(collectionLength + 1, service.getLength());

        Reference lastReference = service.getReferenceByIndex(collectionLength);
        assertEquals(myReference, lastReference);
    }

    @Test
    void shouldAddOneTitleWithPage() {
        Reference myReference = new Reference("Never to be Heard Song", (short) 1033);
        int collectionLength = service.getLength();
        service.addSingleReference(myReference);
        assertEquals(collectionLength + 1, service.getLength());

        Reference lastLine = service.getReferenceByIndex(collectionLength);
        assertEquals(myReference, lastLine);
        assertEquals("Never to be Heard Song", myReference.title);
        assertEquals(1033, myReference.page);
    }

    @Test
    void shouldAddAnotherCollection() {
        int collectionLength = service.getLength();
        service.addCollection(path, "Liederbuecher_a");

        assertEquals(collectionLength + 1374, service.getLength());

        Reference actual = service.getReferenceByIndex(collectionLength + 1);
        assertEquals("A Hard Rain's A Gonna Fall", actual.title);
        assertEquals("Zündschnüre-Song", service.getReferenceByIndex(collectionLength + 1373).title);
    }

    @Test
    void shouldThrowNoSuchFileException() {
        new SongCollection(path, "gehtGarNicht");
        String result = err.toString();
        assertEquals("NoSuchFileException: Die Datei wurde nicht gefunden.\r\n", result);
    }

    @Test
    void shouldThrowIllegalReferenceVolumeException() {
        Exception exception = Assertions.assertThrows(IllegalReferenceVolumeException.class,
                () -> {
                    service.addCollection(path, "serviceTest_WrongVolume");
                });
        assertEquals("IllegalReferenceVolumeException", exception.getClass().getSimpleName());
        assertEquals("Die Liedersammlung \"The Daily Ukulele (Green)\" ist nicht bekannt.", exception.getMessage());
    }

    @Test
    void shouldThrowIllegalPageFormatException() {
        Exception exception = Assertions.assertThrows(IllegalPageFormatException.class,
                () -> {
                    service.addCollection(path, "serviceTest_WrongPageFormat");
                });
        assertEquals("IllegalPageFormatException", exception.getClass().getSimpleName());
        assertEquals("Die Zeichenfolge \" ab12\" in der Liedersammlung \"serviceTest_WrongPageFormat\" ist keine gültige Seitenangabe.", exception.getMessage());
    }

    @AfterEach
    public void restoreInitialStreams() {
        System.setOut(originalOut);
        System.setErr(originalErr);
    }
}
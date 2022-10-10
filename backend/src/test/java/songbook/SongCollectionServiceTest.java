package songbook;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferencesDTO;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static songbook.collections.models.ReferenceVolume.TheDailyUkulele_Yellow;

public class SongCollectionServiceTest {

    private final ReferencesRepository repo = Mockito.mock((ReferencesRepository.class));
    private final SongCollectionService service = new SongCollectionService(repo);

    @Test
    void shouldFindReferenceByIdContainingTitleAndVolume() {
        Reference ref = new Reference("Never Heard This Song Before");
        ref.volume = TheDailyUkulele_Yellow;
        Mockito.when(repo.findById("334455")).thenReturn(Optional.of(ref));

        ReferencesDTO actual = service.getReferenceById("334455");

        assertEquals(new ReferencesDTO(List.of(ref)), actual);
    }

    @Test
    void shouldFindReferenceByIdContainingTitleAndVolumeAndPage() {
        short page = 12;
        Reference ref = new Reference("Never Heard This Song Before", page);
        ref.volume = TheDailyUkulele_Yellow;
        Mockito.when(repo.findById("334455")).thenReturn(Optional.of(ref));

        ReferencesDTO actual = service.getReferenceById("334455");

        assertEquals(new ReferencesDTO(List.of(ref)), actual);
        System.out.println(actual);
    }

/*
    @Test
    void shouldReturnSongTitleFoundBySearchWord() {
        List<Reference> listReturned = service.getReferenceBySearchWord("moon ri");
        String actual = listReturned.get(0).title;
        assertEquals("Moon River", actual);
    }
*/
    /*
    @Test
    void shouldAddOneTitle() {
        Reference myReference = new Reference("Never to be Heard Song; The Daily Ukulele (Green)");
        int collectionLength = service.getLength();
        service.addSingleReference(myReference);
        assertEquals(collectionLength + 1, service.getLength());


        Reference lastReference = service.getReferenceByIndex(collectionLength);
        assertEquals(myReference, lastReference);
    }

     */
/*
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
    void shouldThrowFileNotFoundException() {
        Exception exception = Assertions.assertThrows(FileNotFoundException.class,
                ()-> {
                    new SongCollection(path, "MichGibtsNicht");
                });
        assertEquals("FileNotFoundException", exception.getClass().getSimpleName());
        assertEquals("Die Datei \"MichGibtsNicht\" wurde nicht gefunden.", exception.getMessage());
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
        assertEquals("Die Zeichenfolge \" ab12\" in der Liedersammlung \"serviceTest_WrongPageFormat\" " +
                "ist keine gültige Seitenangabe.", exception.getMessage());
    }

    @Test
    void shouldThrowMalformedFileException() {
        Exception exception = Assertions.assertThrows(MalformedFileException.class,
                () -> {
                    service.addCollection(path, "serviceTest_WrongFileFormat");
                });
        assertEquals("MalformedFileException", exception.getClass().getSimpleName());
        assertEquals("Die Datei \"serviceTest_WrongFileFormat\" wurde gefunden,\n\tkann aber nicht gelesen " +
                "werden. Stellen Sie sicher, dass sie in der Codierung \"UTF-16 BE\" gespeichert wurde!",
                exception.getMessage());
    }

    @Test
    void shouldThrowEmptyFileException() {
        Exception exception = Assertions.assertThrows(EmptyFileException.class,
                () -> {
                    service.addCollection(path, "serviceTest_EmptyFile");
                });
        assertEquals("EmptyFileException", exception.getClass().getSimpleName());
        assertEquals("Die Datei \"serviceTest_EmptyFile\" ist leer.", exception.getMessage());
    }
*/
}
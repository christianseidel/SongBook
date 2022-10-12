package songbook;

import java.lang.invoke.WrongMethodTypeException;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferenceVolume;
import songbook.collections.models.ReferencesDTO;

import static songbook.collections.models.ReferenceVolume.TheDailyUkulele_Blue;
import static songbook.collections.models.ReferenceVolume.TheDailyUkulele_Yellow;

public class SongCollectionServiceTest {

    private final ReferencesRepository repo = Mockito.mock((ReferencesRepository.class));
    private final SongCollectionService service = new SongCollectionService(repo);


    @Test
    void shouldReturnAllReference() {
        ReferenceVolume volume = TheDailyUkulele_Yellow;
        Reference ref01 = new Reference("Here Comes My Music", volume, 123);
        Reference ref02 = new Reference("Here Comes Your Music", volume, 144);
        Reference ref03 = new Reference("Here Is Our Music", volume, 75);
        Reference ref04 = new Reference("Oh, When The Music Ends", volume, 320);
        List<Reference> listUnsorted = List.of(ref03, ref02, ref01, ref04);
        List<Reference> listSorted = List.of(ref01, ref02, ref03, ref04);
        ReferencesDTO referencesSorted = new ReferencesDTO(listSorted);
        Mockito.when(repo.findAll()).thenReturn(listUnsorted);

        ReferencesDTO actual = service.getAllReferences();

        assertEquals(referencesSorted, actual);
    }

    @Test
    void shouldFindReferenceByTitle() {
        ReferenceVolume volume = TheDailyUkulele_Yellow;
        Reference ref01 = new Reference("Here Comes My Music", volume, 123);
        Reference ref02 = new Reference("Here Comes Your Music", volume, 144);
        Reference ref03 = new Reference("Oh, Here Comes Your Ice Cream", volume, 320);
        List<Reference> list = List.of(ref01, ref02, ref03);
        ReferencesDTO referencesDTO = new ReferencesDTO(list);
        Mockito.when(repo.findAll()).thenReturn(list);

        ReferencesDTO actual = service.getReferencesByTitle("Here Comes");

        assertEquals(referencesDTO, actual);
    }

    @Test
    void shouldCreateReference() {
        Reference ref = new Reference("There Goes My Music", TheDailyUkulele_Blue, 32);

        service.createReference(ref);

        verify(repo).save(ref);
    }

    @Test
    void shouldFindReferenceByID() {
        Reference ref = new Reference("Here Comes My Music", TheDailyUkulele_Yellow, 123);
        String myId = ref.getId();
        ReferencesDTO myDTO = new ReferencesDTO(List.of(ref));
        Mockito.when(repo.findById(myId)).thenReturn(Optional.of(ref));

        ReferencesDTO actual = service.getReferenceById(myId);

        assertEquals(myDTO, actual);
    }

    @Test
    void shouldThrowExceptionWhenLookingUpForWrongId() {
        String myId = "454566";
        Mockito.when(repo.findById(myId)).thenReturn(Optional.empty());

        Assertions.assertThatExceptionOfType(NoSuchIdException.class)
                .isThrownBy(()->service.getReferenceById(myId));
    }

    @Test
    void shouldDeleteReference() {
        String myId = "234234234";
        Reference myReference = new Reference(" You May Sing My Song, Brother", TheDailyUkulele_Blue, 123);
        myReference.setId(myId);
        Mockito.when(repo.findById(myId)).thenReturn(Optional.of(myReference));

        service.deleteReference(myId);

        verify(repo).deleteById(myId);
    }

    @Test
    void shouldThrowExceptionWhenTryingToDeleteItemWithWrongId() {
        Assertions.assertThatExceptionOfType(NoSuchIdException.class)
                .isThrownBy(()->service.deleteReference("890-980"));
    }

    @Test
    void shouldFindReferenceByIdWithReferenceHavingTitleAndVolume() {
        Reference ref = new Reference("Never Heard This Song Before", TheDailyUkulele_Yellow);
        Mockito.when(repo.findById("334455")).thenReturn(Optional.of(ref));

        ReferencesDTO actual = service.getReferenceById("334455");

        assertEquals(new ReferencesDTO(List.of(ref)), actual);
    }

    @Test
    void shouldFindReferenceByIdWithReferenceHavingTitleAndVolumeAndPage() {
        Reference ref = new Reference("Never Heard This Song Before", TheDailyUkulele_Yellow, 12);
        Mockito.when(repo.findById("334455")).thenReturn(Optional.of(ref));

        ReferencesDTO actual = service.getReferenceById("334455");

        assertEquals(new ReferencesDTO(List.of(ref)), actual);
    }
/*

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
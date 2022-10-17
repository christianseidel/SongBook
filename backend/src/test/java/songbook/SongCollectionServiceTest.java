package songbook;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static songbook.collections.models.ReferenceVolume.*;

import org.springframework.mock.web.MockMultipartFile;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.collections.UploadResult;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferenceVolume;
import songbook.collections.models.ReferencesDTO;

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
    void shouldThrowExceptionWhenLookingUpReferenceWithWrongId() {
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
    void shouldSaveEditedReference() {
        Reference initialReference = new Reference("All The Leaves Are Green", TheDailyUkulele_Blue, 334);
        String id = initialReference.getId();
        Reference changedReference = new Reference("All The Leaves Are Brown", TheDailyUkulele_Blue, 222);
        Mockito.when(repo.findById(id)).thenReturn(Optional.of(initialReference));
        Mockito.when(repo.save(changedReference)).thenReturn(changedReference);

        Reference actual = service.editReference(id, changedReference);

        assertEquals(changedReference, actual);
    }

    @Test
    void shouldThrowExceptionWhenTryingToSetInvalidPageDatum() {

    }

    @Test
    void shouldThrowExceptionWhenTryingToEditItemWithWrongId() {
        Reference changedRef = new Reference("All The Leaves Are Gone", TheDailyUkulele_Blue, 222);
        Assertions.assertThatExceptionOfType(NoSuchIdException.class)
                .isThrownBy(()->service.editReference("55555-25", changedRef));
    }

    @Test
    void shouldSaveCopyOfReference() {
        Reference initialRef = new Reference("All The Leaves Are Brown", TheDailyUkulele_Yellow, 100);
        Reference copiedRef = new Reference("All The Leaves Are Brown", TheDailyUkulele_Yellow, 100);
        Mockito.when(repo.findById(initialRef.getId())).thenReturn(Optional.of(initialRef));
        Mockito.when(repo.save(any())).thenReturn(copiedRef);

        ReferencesDTO actual = service.copyReferenceById(initialRef.getId());

        assertEquals(copiedRef.getId(), actual.getReferenceList().get(0).getId());
        verify(repo).save(any());
    }

    @Test
    void shouldAddNewReferenceToCollection() {
        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                "This Is My Song, Yeah; The Daily Ukulele (Blue); 477"
                        .getBytes(StandardCharsets.UTF_8)
        );

        String title = "This Is My Song, Yeah";
        Collection<Reference> collection = List.of();
        Mockito.when(repo.findAllByTitleAndVolume(title, TheDailyUkulele_Blue)).thenReturn(collection);
        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(1);
        uploadResult.setTotalNumberOfReferences(1);

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
    }

    @Test
    void shouldAddFourNewReferenceToCollection() {
        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                ("This Is My Song, Yeah; The Daily Ukulele (Blue); 477\n" +
                        " What Is This You Are Singing; The Daily Ukulele (Yellow); 333  \n" +
                        "When The Saints Go Marching In; Liederbuch\n" +
                        "i forgot to sing my song today; Liederbuch ; 2" )
                        .getBytes(StandardCharsets.UTF_8)
        );

        String title1 = "This Is My Song, Yeah";
        String title2 = " What Is This You Are Singing";
        String title3 = "When The Saints Go Marching Inn";
        String title4 = "i forgot to sing my song today";

        Collection<Reference> collection = List.of();
        Mockito.when(repo.findAllByTitleAndVolume(title1, TheDailyUkulele_Blue)).thenReturn(collection);
        Mockito.when(repo.findAllByTitleAndVolume(title2, TheDailyUkulele_Yellow)).thenReturn(collection);
        Mockito.when(repo.findAllByTitleAndVolume(title3, Liederbuch_1)).thenReturn(collection);
        Mockito.when(repo.findAllByTitleAndVolume(title4, Liederbuch_1)).thenReturn(collection);

        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(4);
        uploadResult.setTotalNumberOfReferences(4);

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
    }

    @Test
    void shouldRefuseToAddExistingReferenceToCollection() {
        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                "This Is My Song, Yeah; The Daily Ukulele (Blue); 477"
                        .getBytes(StandardCharsets.UTF_8)
        );

        String title = "This Is My Song, Yeah";
        Collection<Reference> collection = List.of(new Reference("This Is My Song, Yeah", TheDailyUkulele_Blue));
        Mockito.when(repo.findAllByTitleAndVolume(title, TheDailyUkulele_Blue)).thenReturn(collection);
        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(0);
        uploadResult.setNumberOfExistingReferences(1);
        uploadResult.setTotalNumberOfReferences(1);

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
    }

    @Test
    void shouldAcceptEmptyFileReturningZeroAdditions() {
        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                "".getBytes(StandardCharsets.UTF_8)
        );

        String title = "";
        Collection<Reference> collection = List.of();
        Mockito.when(repo.findAllByTitleAndVolume(title, TheDailyUkulele_Blue)).thenReturn(collection);
        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(0);
        uploadResult.setNumberOfExistingReferences(0);
        uploadResult.setTotalNumberOfReferences(0);

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
    }

    @Test
    void shouldRefuseToAddReferenceWithMalformedPageDatum() {
        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                "This Is Not My Song, Bro; The Daily Ukulele (Blue); ab23ab".getBytes(StandardCharsets.UTF_8)
        );

        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(0);
        uploadResult.setNumberOfExistingReferences(0);
        uploadResult.setTotalNumberOfReferences(1);
        uploadResult.setNumberOfReferencesRejected(1);
        uploadResult.addLineWithInvalidPageDatum("This Is Not My Song, Bro; The Daily Ukulele (Blue); ab23ab");

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
    }

    @Test
    void shouldRefuseToAddReferencesWithIllegalVolumeData() {
        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                ("This Is Not My Song, Bro; The Daily Ukulele (Green); 333\n" +
                        "This Isn't My Song Either, Sister; The Daily Song Book; 444")
                        .getBytes(StandardCharsets.UTF_8)
        );

        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(0);
        uploadResult.setNumberOfExistingReferences(0);
        uploadResult.setTotalNumberOfReferences(2);
        uploadResult.setNumberOfReferencesRejected(2);
        uploadResult.addLineWithInvalidVolumeDatum("This Is Not My Song, Bro; The Daily Ukulele (Green); 333");
        uploadResult.addLineWithInvalidVolumeDatum("This Isn't My Song Either, Sister; The Daily Song Book; 444");

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
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
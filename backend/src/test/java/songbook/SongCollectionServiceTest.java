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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static songbook.collections.models.SongCollection.*;

import org.springframework.mock.web.MockMultipartFile;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.collections.UploadResult;
import songbook.collections.exceptions.EmptyFileException;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.models.Reference;
import songbook.collections.models.SongCollection;
import songbook.collections.models.ReferencesDTO;

public class SongCollectionServiceTest {

    private final ReferencesRepository repo = Mockito.mock((ReferencesRepository.class));
    private final SongCollectionService service = new SongCollectionService(repo);


    @Test
    void shouldReturnAllReferences() {
        SongCollection collection = THE_DAILY_UKULELE_YELLOW;
        Reference ref01 = new Reference("Here Comes My Music", collection, 123);
        Reference ref02 = new Reference("Here Comes Your Music", collection, 144);
        Reference ref03 = new Reference("Here Is Our Music", collection, 75);
        Reference ref04 = new Reference("Oh, When The Music Ends", collection, 320);
        List<Reference> listUnsorted = List.of(ref03, ref02, ref01, ref04);
        List<Reference> listSorted = List.of(ref01, ref02, ref03, ref04);
        ReferencesDTO referencesSorted = new ReferencesDTO(listSorted);
        Mockito.when(repo.findAll()).thenReturn(listUnsorted);

        ReferencesDTO actual = service.getAllReferences();

        assertEquals(referencesSorted, actual);
    }

    @Test
    void shouldFindReferenceByTitle() {
        SongCollection collection = THE_DAILY_UKULELE_YELLOW;
        Reference ref01 = new Reference("Here Comes My Music", collection, 123);
        Reference ref02 = new Reference("Here Comes Your Music", collection, 144);
        Reference ref03 = new Reference("Oh, Here Comes Your Ice Cream", collection, 320);
        List<Reference> list = List.of(ref01, ref02, ref03);
        ReferencesDTO referencesDTO = new ReferencesDTO(list);
        Mockito.when(repo.findAll()).thenReturn(list);

        ReferencesDTO actual = service.getReferencesByTitle("Here Comes");

        assertEquals(referencesDTO, actual);
    }

    @Test
    void shouldCreateReference() {
        Reference ref = new Reference("There Goes My Music", THE_DAILY_UKULELE_BLUE, 32);

        service.createReference(ref);

        verify(repo).save(ref);
    }

    @Test
    void shouldFindReferenceById() {
        Reference ref = new Reference("Never Heard This Song Before", THE_DAILY_UKULELE_YELLOW, 12);
        ReferencesDTO referencesDTO = new ReferencesDTO(List.of(ref));
        Mockito.when(repo.findById("334455")).thenReturn(Optional.of(ref));

        ReferencesDTO actual = service.getReferenceById("334455");

        assertEquals(referencesDTO, actual);
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
        Reference myReference = new Reference(" You May Sing My Song, Brother", THE_DAILY_UKULELE_BLUE, 123);
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
        Reference initialReference = new Reference("All The Leaves Are Green", THE_DAILY_UKULELE_BLUE, 334);
        String id = initialReference.getId();
        Reference changedReference = new Reference("All The Leaves Are Brown", THE_DAILY_UKULELE_BLUE, 222);
        Mockito.when(repo.findById(id)).thenReturn(Optional.of(initialReference));
        Mockito.when(repo.save(changedReference)).thenReturn(changedReference);

        Reference actual = service.editReference(id, changedReference);

        assertEquals(changedReference, actual);
    }

    @Test
    void shouldThrowExceptionWhenTryingToEditItemWithWrongId() {
        Reference changedRef = new Reference("All The Leaves Are Gone", THE_DAILY_UKULELE_BLUE, 222);
        Assertions.assertThatExceptionOfType(NoSuchIdException.class)
                .isThrownBy(()->service.editReference("55555-25", changedRef));
    }

    @Test
    void shouldSaveCopyOfReference() {
        Reference initialRef = new Reference("All The Leaves Are Brown", THE_DAILY_UKULELE_YELLOW, 100);
        Reference copiedRef = new Reference("All The Leaves Are Brown", THE_DAILY_UKULELE_YELLOW, 100);
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
        Mockito.when(repo.findAllByTitleAndSongCollection(title, THE_DAILY_UKULELE_BLUE)).thenReturn(collection);
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
        Mockito.when(repo.findAllByTitleAndSongCollection(title1, THE_DAILY_UKULELE_BLUE)).thenReturn(collection);
        Mockito.when(repo.findAllByTitleAndSongCollection(title2, THE_DAILY_UKULELE_YELLOW)).thenReturn(collection);
        Mockito.when(repo.findAllByTitleAndSongCollection(title3, LIEDERBUCH_1)).thenReturn(collection);
        Mockito.when(repo.findAllByTitleAndSongCollection(title4, LIEDERBUCH_1)).thenReturn(collection);

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
        Collection<Reference> collection = List.of(new Reference("This Is My Song, Yeah", THE_DAILY_UKULELE_BLUE));
        Mockito.when(repo.findAllByTitleAndSongCollection(title, THE_DAILY_UKULELE_BLUE)).thenReturn(collection);
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
    void shouldRejectReferencesWithIllegalCollectionName() {
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
        uploadResult.addLineWithInvalidCollectionName("This Is Not My Song, Bro; The Daily Ukulele (Green); 333");
        uploadResult.addLineWithInvalidCollectionName("This Isn't My Song Either, Sister; The Daily Song Book; 444");

        UploadResult actual = new UploadResult();
        try {
            actual = service.processMultipartFileUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);
    }

    @Test
    void shouldThrowEmptyFileException() {
        MockMultipartFile zeroRefUpload = new MockMultipartFile(
                "importZeroReference.txt",
                "importZeroReference.txt",
                "text/plain",
                "".getBytes(StandardCharsets.UTF_8)
        );

        Exception exception = assertThrows(EmptyFileException.class,
                () -> {
                    service.processMultipartFileUpload(zeroRefUpload);
                });
        assertEquals("EmptyFileException", exception.getClass().getSimpleName());
        assertEquals("The file 'importZeroReference.txt' is empty. There are no references to process.", exception.getMessage());
    }

    @Test
    void shouldSetReferenceToHidden() {
        Reference initialReference = new Reference("Singing In The Rain", THE_DAILY_UKULELE_YELLOW, 35);
        String id = initialReference.getId();
        Mockito.when(repo.findById(id)).thenReturn(Optional.of(initialReference));
        Reference hiddenReference = new Reference("Singing In The Rain", THE_DAILY_UKULELE_YELLOW, 35);
        hiddenReference.setId(id);
        hiddenReference.setHidden(true);

        service.hideReference(id);

        verify(repo).save(hiddenReference);
    }

    @Test
    void shouldSetReferenceToNotHidden() {
        Reference initialReference = new Reference("Singing In The Rain", THE_DAILY_UKULELE_YELLOW, 35);
        String id = initialReference.getId();
        initialReference.setHidden(true);
        Mockito.when(repo.findById(id)).thenReturn(Optional.of(initialReference));
        Reference unhiddenReference = new Reference("Singing In The Rain", THE_DAILY_UKULELE_YELLOW, 35);
        unhiddenReference.setId(id);
        unhiddenReference.setHidden(false);

        service.unhideReference(id);

        verify(repo).save(unhiddenReference);
    }

    @Test
    void shouldNotReturnHiddenReferenceWhenLookingUpAllReferences() {
        SongCollection collection = THE_DAILY_UKULELE_YELLOW;
        Reference ref01 = new Reference("Here Comes My Music", collection, 123);
        Reference ref02 = new Reference("Here Comes Your Music", collection, 144);
        Reference ref04 = new Reference("Oh, When The Music Ends", collection, 320);
        ref04.setHidden(false);
        Reference ref07 = new Reference("Here Comes My Silent Music", collection, 007);
        ref07.setHidden(true);
        List<Reference> fullList = List.of(ref02, ref01, ref04, ref07);
        Mockito.when(repo.findAll()).thenReturn(fullList);

        ReferencesDTO actual = service.getAllReferences();

        assertEquals(new ReferencesDTO(List.of(ref01, ref02, ref04)), actual);
    }

    @Test
    void shouldNotFindHiddenReferenceWhenSearchingByTitle() {
        SongCollection collection = THE_DAILY_UKULELE_YELLOW;
        Reference ref01 = new Reference("Here Comes My Music", collection, 123);
        Reference ref02 = new Reference("Oh, Here Comes Your Ice Cream", collection, 320);
        Reference ref03 = new Reference("Here Comes Your Music", collection, 144);
        Reference ref07 = new Reference("Here Comes My Silent Music", collection, 007);
        ref07.setHidden(true);
        List<Reference> list = List.of(ref01, ref02, ref03, ref07);
        Mockito.when(repo.findAll()).thenReturn(list);

        ReferencesDTO actual = service.getReferencesByTitle("Here Comes");

        assertEquals(new ReferencesDTO(List.of(ref01, ref03, ref02)), actual);
    }
}
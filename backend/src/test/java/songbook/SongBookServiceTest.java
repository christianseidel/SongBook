package songbook;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.exceptions.NoSuchIdException;
import songbook.collections.models.Reference;
import songbook.models.Song;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static songbook.collections.models.SongCollection.*;


class SongBookServiceTest {

    private final SongRepository songRepository = Mockito.mock(SongRepository.class);
    private final SongCollectionService songCollectionService = Mockito.mock(SongCollectionService.class);
    private final ReferencesRepository referencesRepository = Mockito.mock(ReferencesRepository.class);
    private final SongSheetsRepository songSheetsRepository = Mockito.mock(SongSheetsRepository.class);
    private final SongBookService songBookService = new SongBookService(songRepository,
            songCollectionService,
            referencesRepository,
            songSheetsRepository);

    @Test
    void shouldAddNewSong() {
        Song song = new Song("testSong", "me and myself");
        songBookService.createSong(song);

        verify(songRepository).save(song);
    }

    @Test
    void shouldDeleteSong() {
        Song song = new Song("testSong", "me and myself");
        song.setId("123456");
        song.setUser("Hans");
        Mockito.when(songRepository.findByIdAndUser("123456", "Hans")).thenReturn(Optional.of(song));

        songBookService.createSong(song);
        songBookService.deleteSong("123456", "Hans");

        verify(songRepository).deleteById("123456");
    }

    @Test
    void shouldThrowExceptionWhenTryingToDeleteSongWithWrongId() {
        String id = "21312131";
        Mockito.when(songRepository.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            songBookService.deleteSong(id, "Hans");
        });
        assertEquals("This song has not been deleted! A song with Id no. \"21312131\" could not be found.",
                exception.getMessage());
    }

    @Test
    void shouldEditSong() {
        // given
        Song song01new = new Song("testSong 1", "me and myself");
        song01new.setId("123456_1");
        song01new.setUser("Franz");

        Song song01edited = new Song("testSong edited", "you and me");
        song01edited.setId("123456_2");
        song01edited.setUser("Franz");

        Mockito.when(songRepository.findByIdAndUser("123456_1", "Franz")).thenReturn(Optional.of(song01new));
        Mockito.when(songRepository.save(song01edited)).thenReturn(song01edited);

        songBookService.createSong(song01new);
        songBookService.editSong(song01new.getId(), song01edited, "Franz");

        // when
        Optional<Song> actual = songBookService.editSong("123456_1", song01edited, "Franz");

        // then
        Assertions.assertThat(actual).contains(song01edited);
    }

    @Test
    void shouldThrowExceptionWhenTryingToEditSongWithWrongId() {
        String id = "45678";
        Mockito.when(referencesRepository.findById(id)).thenReturn(Optional.empty());

        Song songEdited = new Song("simple test song");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            songBookService.editSong(id, songEdited, "Paulina");
        });
        assertEquals("A song with Id no. \"45678\" could not be found. " +
                        "Consequently, your song has not been changed!",
                exception.getMessage());
    }

    @Test
    void shouldRetrieveAllSongs() {
        Song song01 = new Song("testSong 1", "Alphonse");
        song01.setId("123456_1");
        song01.setUser("Mathias");
        Song song02 = new Song("testSong 2", "Bertrand");
        song02.setId("123456_2");
        song02.setUser("Mathias");
        Song song03 = new Song("testSong 3", "Claude");
        song03.setId("123456_3");
        song03.setUser("Mathias");
        List<Song> songList = List.of(song01, song02, song03);
        Mockito.when(songRepository.findAll()).thenReturn(songList);

        List<Song> actual = songBookService.getAllSongs("Mathias");

        Assertions.assertThat(actual).isEqualTo(songList);
    }

    @Test
    void shouldRetrieveOneSong() {
        Song song = new Song("My Test Song", "Me and Myeself", 2022);
        String id = "123456789";
        song.setId(id);
        song.setUser("Florian");
        Mockito.when(songRepository.findByIdAndUser(id, "Florian")).thenReturn(Optional.of(song));

        Optional<Song> actual = songBookService.getSingleSong(id, "Florian");

        Assertions.assertThat(Optional.of(song)).isEqualTo(actual);
    }


    @Test
    void shouldCreateSongFromReferenceAndAddReference() {
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 22);
        String id = reference.getId();
        Mockito.when(referencesRepository.findById(id)).thenReturn(Optional.of(reference));
        Mockito.when(songRepository.findByTitleAndUser("Here Comes The Sun", "Sandra")).thenReturn(Optional.empty());
        Song newSong = new Song("Here Comes The Sun");
        newSong.setUser("Sandra");
        newSong.setReferences(List.of(reference));
        Mockito.when(songRepository.save(any())).thenReturn(newSong);

        // check creates song
        Song actual = songBookService.createSongFromReference(id, "Sandra");
        assertEquals(newSong, actual);

        // check adds reference
        assertEquals(reference, actual.getReferences().get(0));

        // check hides reference
        assertTrue(actual.getReferences().get(0).isHidden());
    }

    @Test
    void shouldThrowExceptionWhenTryingToCreateSongFromReferenceWithWrongId() {
        String id = "22112211";
        Mockito.when(referencesRepository.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchIdException.class, () -> {
            songBookService.createSongFromReference(id, "Barbara");
        });
        assertEquals("Server is unable to find your reference's ID.", exception.getMessage());
    }

    @Test
    void shouldHideReferenceAndAddToSongWhenCreatingSongFromReferenceWithSongAlreadyExisting() {
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        reference.setHidden(false);
        String referenceId = reference.getId();
        Mockito.when(referencesRepository.findById(referenceId)).thenReturn(Optional.of(reference));
        Song existingSong = new Song(
                "Here Comes The Sun",
                "The Beatles",
                1969);
        existingSong.setUser("Hermine");
        Mockito.when(songRepository.findByTitleAndUser("Here Comes The Sun", "Hermine"))
                .thenReturn(Optional.of(existingSong));
        Mockito.when(songRepository.save(existingSong)).thenReturn(existingSong);

        Song actual = songBookService.createSongFromReference(referenceId, "Hermine");

        // check updates song
        verify(songRepository).save(existingSong);

        // check if reference is hidden
        assertTrue(actual.getReferences().get(0).isHidden());
    }

    @Test
    void shouldAddOneReferenceToSongWithNoReference() {
        Song song = new Song(
                "Here Comes The Sun",
                "The Beatles",
                1969);
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);

        Song actual = songBookService.addOneReferenceToSong(song, reference, "Gabi");
        assertTrue(actual.getReferences().size() == 1);
    }

    @Test
    void shouldAddOneReferenceToSongWithOneReference() {
        Song song = new Song(
                "Here Comes The Sun",
                "The Beatles",
                1969);
        song.setUser("Bernd");
        Reference firstReference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        ArrayList<Reference> references = new ArrayList<>();
        references.add(firstReference);
        song.setReferences(references);
        Reference secondReference = new Reference("Here Comes The Sun", LIEDERGARTEN_12, 12);

        Song actual = songBookService.addOneReferenceToSong(song, secondReference, "Bernd");
        assertTrue(actual.getReferences().size() == 2);
    }


    @Test
    void shouldUnhideTwoReferences() {
        Reference referenceFromCollection = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        Reference referenceAddedManually = new Reference("Here Comes The Sun", MANUALLY_ADDED_COLLECTION, 48);
        referenceAddedManually.setId(null);
        Song singSunSong = new Song("Here Comes The Sun", "The Beatles", 1969);
        singSunSong.setUser("Stefanie");
        List<Reference> references = List.of(referenceFromCollection, referenceAddedManually);
        singSunSong.setReferences(references);
        Mockito.when(songRepository.findById(singSunSong.getId())).thenReturn(Optional.of(singSunSong));
        Mockito.when(referencesRepository.findById(referenceFromCollection.getId())).thenReturn(Optional.of(referenceFromCollection));
        Mockito.when(referencesRepository.findById(referenceAddedManually.getId())).thenReturn(Optional.of(referenceAddedManually));

        String actual = songBookService.unhideAllReferencesOfASong(singSunSong.getId(), "Paula");

        assertEquals("All references are reinserted into Reference Index. References with no existing record were created.", actual);
        assertNotNull(referenceAddedManually.getId());
    }

    @Test
    void shouldReturnIdNotFoundMessageWhenTryingToUnhideNonExistingReference() {
        Mockito.when(songRepository.findById("7755577")).thenReturn(Optional.empty());

        String actual = songBookService.unhideAllReferencesOfASong("7755577", "Paula");

        assertEquals("A song with id # \"7755577\" could not be found.", actual);
    }



    /*@Test

    void shouldUploadSongSheetItem() {
        String path = "src/test/resources/songSheets/DummySongSheet.pdf";
        File pdfFile = new File(path);
        String id = "5566446655664466";

        MockMultipartFile multipartSongSheet = new MockMultipartFile(
                "file",
                "DummySongSheet.pdf",
        "pdf",
        pdfFile.getBytes());

        songBookService.uploadSongSheet(pdfFile, id);

        String absolutePath = pdfFile.getAbsolutePath();

        System.out.println(absolutePath);

        assertTrue(absolutePath.endsWith("src\\test\\resources\\songSheets"));



        MockMultipartFile oneRefUpload = new MockMultipartFile(
                "importOneReference.txt",
                "importOneReference.txt",
                "text/plain",
                "This Is My Song, Yeah; The Daily Ukulele (Blue); 477"
                        .getBytes(StandardCharsets.UTF_8)
        );

        Collection<Reference> collection = List.of();
        Mockito.when(repo.findAllByTitleAndSongCollection("This Is My Song, Yeah", THE_DAILY_UKULELE_BLUE)).thenReturn(collection);
        UploadResult uploadResult = new UploadResult();
        uploadResult.setNumberOfReferencesAccepted(1);
        uploadResult.setTotalNumberOfReferences(1);

        UploadResult actual = new UploadResult();
        try {
            actual = service.processCollectionUpload(oneRefUpload);
        } catch (IOException e) {
            e.printStackTrace();
        }

        assertEquals(uploadResult, actual);

    }
*/

}

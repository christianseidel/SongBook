package songbook;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.collections.exceptions.NoSuchIdException;
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

    SongBookService songBookService;
    SongsRepository songsRepo = Mockito.mock(SongsRepository.class);
    SongCollectionService songCollectionService = Mockito.mock(SongCollectionService.class);
    ReferencesRepository referencesRepo = Mockito.mock(ReferencesRepository.class);

    @BeforeEach
    public void setup() {
        SongBookService songBookService = new SongBookService(songsRepo, songCollectionService, referencesRepo);
        this.songBookService = songBookService;
    }

    @Test
    void shouldAddNewSong() {
        Song song = new Song("testSong", "me and myself");

        songBookService.createSong(song);

        verify(songsRepo).save(song);
    }

    @Test
    void shouldDeleteSong() {
        Song song = new Song("testSong", "me and myself");
        song.setId("123456");
        Mockito.when(songsRepo.findById("123456")).thenReturn(Optional.of(song));

        songBookService.createSong(song);
        songBookService.deleteSong("123456");

        verify(songsRepo).deleteById("123456");
    }

    @Test
    void shouldThrowExceptionWhenTryingToDeleteSongWithWrongId() {
        String id = "21312131";
        Mockito.when(songsRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            songBookService.deleteSong(id);
        });
        assertEquals("This song has NOT been DELETED! A song with Id no. \"21312131\" could not be found.",
                exception.getMessage());
    }

    @Test
    void shouldEditSong() {
        // given
        Song song01new = new Song("testSong 1", "me and myself");
        song01new.setId("123456_1");

        Song song01edited = new Song("testSong edited", "you and me");
        song01edited.setId("123456_2");

        Mockito.when(songsRepo.findById("123456_1")).thenReturn(Optional.of(song01new));
        Mockito.when(songsRepo.save(song01edited)).thenReturn(song01edited);

        songBookService.createSong(song01new);
        songBookService.editSong(song01new.getId(), song01edited);

        // when
        Optional<Song> actual = songBookService.editSong("123456_1", song01edited);

        // then
        Assertions.assertThat(actual).contains(song01edited);
    }

    @Test
    void shouldThrowExceptionWhenTryingToEditSongWithWrongId() {
        String id = "45678";
        Mockito.when(referencesRepo.findById(id)).thenReturn(Optional.empty());

        Song songEdited = new Song("simple test song");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            songBookService.editSong(id, songEdited);
        });
        assertEquals("This song has NOT been CHANGED! A song with Id no. \"45678\" could not be found.",
                exception.getMessage());
    }

    @Test
    void shouldRetrieveAllSongs() {
        Song song01 = new Song("testSong 1", "Alphonse");
        song01.setId("123456_1");
        Song song02 = new Song("testSong 2", "Bertrand");
        song02.setId("123456_2");
        Song song03 = new Song("testSong 3", "Claude");
        song03.setId("123456_3");
        List<Song> songList = List.of(song01, song02, song03);
        Mockito.when(songsRepo.findAll()).thenReturn(songList);

        List<Song> actual = songBookService.getAllSongs();

        Assertions.assertThat(actual).isEqualTo(songList);
    }

    @Test
    void shouldRetrieveOneSong() {
        Song song = new Song("My Test Song", "Me and Myeself", 2022);
        String id = "123456789";
        song.setId(id);
        Mockito.when(songsRepo.findById(id)).thenReturn(Optional.of(song));

        Optional<Song> actual = songBookService.getSingleSong(id);

        Assertions.assertThat(Optional.of(song)).isEqualTo(actual);
    }


    @Test
    void shouldCreateSongFromReferenceAndAddReference() {
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 22);
        String id = reference.getId();
        Mockito.when(referencesRepo.findById(id)).thenReturn(Optional.of(reference));
        Mockito.when(songsRepo.findByTitle("Here Comes The Sun")).thenReturn(Optional.empty());
        Song newSong = new Song("Here Comes The Sun");
        newSong.setReferences(List.of(reference));
        Mockito.when(songsRepo.save(any())).thenReturn(newSong);

        // check creates song
        Song actual = songBookService.createSongFromReference(id);
        assertEquals(newSong, actual);

        // check adds reference
        assertEquals(reference, actual.getReferences().get(0));

        // check hides reference
        assertTrue(actual.getReferences().get(0).isHidden());
    }

    @Test
    void shouldThrowExceptionWhenTryingToCreateSongFromReferenceWithWrongId() {
        String id = "22112211";
        Mockito.when(referencesRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchIdException.class, () -> {
            songBookService.createSongFromReference(id);
        });
        assertEquals("Server is unable to find your reference's ID.", exception.getMessage());
    }

    @Test
    void shouldHideReferenceAndAddToSongWhenCreatingSongFromReferenceWithSongAlreadyExisting() {
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        reference.setHidden(false);
        String referenceId = reference.getId();
        Mockito.when(referencesRepo.findById(referenceId)).thenReturn(Optional.of(reference));
        Song existingSong = new Song(
                "Here Comes The Sun",
                "The Beatles",
                1969);
        Mockito.when(songsRepo.findByTitle("Here Comes The Sun"))
                .thenReturn(Optional.of(existingSong));
        Mockito.when(songsRepo.save(existingSong)).thenReturn(existingSong);

        Song actual = songBookService.createSongFromReference(referenceId);

        // check updates song
        verify(songsRepo).save(existingSong);

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

        Song actual = songBookService.addOneReferenceToSong(song, reference);
        assertTrue(actual.getReferences().size() == 1);
    }

    @Test
    void shouldAddOneReferenceToSongWithOneReference() {
        Song song = new Song(
                "Here Comes The Sun",
                "The Beatles",
                1969);
        Reference firstReference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        ArrayList<Reference> references = new ArrayList<>();
        references.add(firstReference);
        song.setReferences(references);
        Reference secondReference = new Reference("Here Comes The Sun", LIEDERGARTEN_12, 12);

        Song actual = songBookService.addOneReferenceToSong(song, secondReference);
        assertTrue(actual.getReferences().size() == 2);
    }


    @Test
    void shouldUnhideTwoReferences() {
        Reference referenceFromCollection = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        Reference referenceAddedManually = new Reference("Here Comes The Sun", MANUALLY_ADDED_COLLECTION, 48);
        referenceAddedManually.setId(null);
        Song singSunSong = new Song("Here Comes The Sun", "The Beatles", 1969);
        List<Reference> references = List.of(referenceFromCollection, referenceAddedManually);
        singSunSong.setReferences(references);
        Mockito.when(songsRepo.findById(singSunSong.getId())).thenReturn(Optional.of(singSunSong));
        Mockito.when(referencesRepo.findById(referenceFromCollection.getId())).thenReturn(Optional.of(referenceFromCollection));
        Mockito.when(referencesRepo.findById(referenceAddedManually.getId())).thenReturn(Optional.of(referenceAddedManually));

        String actual = songBookService.unhideAllReferencesOfASong(singSunSong.getId());

        assertEquals("All songs are reinserted into Reference Index.", actual);
        assertNotNull(referenceAddedManually.getId());
    }

    @Test
    void shouldReturnIdNotFoundMessageWhenTryingToUnhideNonExistingReference() {
        Mockito.when(songsRepo.findById("7755577")).thenReturn(Optional.empty());

        String actual = songBookService.unhideAllReferencesOfASong("7755577");

        assertEquals("A song with id # \"7755577\" could not be found.", actual);
    }

}

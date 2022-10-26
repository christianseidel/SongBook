package songbook;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import songbook.collections.ReferencesRepository;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.exceptions.SongAlreadyExistsException;
import songbook.collections.models.Reference;
import songbook.models.Song;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static songbook.collections.models.SongCollection.*;

class SongBookServiceTest {

    SongBookService songBookService;
    SongsRepository songsRepo = Mockito.mock(SongsRepository.class);
    ReferencesRepository referencesRepo = Mockito.mock(ReferencesRepository.class);

    @BeforeEach
    public void setup() {
        SongBookService songBookService = new SongBookService(songsRepo, referencesRepo);
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

/*    @Test
    void shouldCreateSongFromReference() {
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 22);
        String id = reference.getId();
        Mockito.when(referencesRepo.findById(id)).thenReturn(Optional.of(reference));
        Mockito.when(songsRepo.findByTitle("Here Comes The Sun")).thenReturn(false);
        Song sunSong = new Song("Here Comes The Sun");
        Mockito.when(songsRepo.save(any())).thenReturn(sunSong);

        Song actual = songBookService.createSongFromReference(id);

        assertEquals(sunSong, actual);
    }*/

    @Test
    void shouldThrowExceptionWhenTryingToCreateSongFromReferenceWithWrongId() {
        String id = "22112211";
        Mockito.when(referencesRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(NoSuchIdException.class, () -> {
            songBookService.createSongFromReference(id);
        });
        assertEquals("Server is unable to find your reference's ID.", exception.getMessage());
    }

    /*@Test
    void shouldThrowExceptionWhenTryingToCreateSongFromReferenceWithExistingTitle() {
        Reference reference = new Reference("Here Comes The Sun", THE_DAILY_UKULELE_YELLOW, 24);
        String id = reference.getId();
        Mockito.when(referencesRepo.findById(id)).thenReturn(Optional.of(reference));
        Mockito.when(songsRepo.findByTitle("Here Comes The Sun")).thenReturn(true);

        Exception exception = assertThrows(SongAlreadyExistsException.class, () -> {
                    songBookService.createSongFromReference(id);
                });
        assertEquals("The song 'Here Comes The Sun' already exists.", exception.getMessage());
    }*/
}

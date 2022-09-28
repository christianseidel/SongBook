package songbook;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import songbook.models.Song;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;

class SongBookServiceTest {

    @Test
    void addNewSong() {
        Song song = new Song("testSong", "me and myself");
        SongsRepository repo = Mockito.mock(SongsRepository.class);
        SongBookService songBookService = new SongBookService(repo);

        songBookService.createSong(song);

        verify(repo).save(song);
    }

    @Test
    void deleteSong() {
        Song song = new Song("testSong", "me and myself");
        song.id = "123456";
        SongsRepository repo = Mockito.mock(SongsRepository.class);
        SongBookService songBookService = new SongBookService(repo);
        Mockito.when(repo.findById("123456")).thenReturn(Optional.of(song));

        songBookService.createSong(song);
        songBookService.deleteSong("123456");

        verify(repo).deleteById("123456");
    }

    @Test
    void changeSong() {
        // given
        Song song01new = new Song("testSong 1", "me and myself");
        song01new.id = "123456_1";
        SongsRepository repo = Mockito.mock(SongsRepository.class);
        SongBookService songBookService = new SongBookService(repo);

        Song song01edited = new Song("testSong edited", "you and me");
        song01edited.id = "123456_2";

        Mockito.when(repo.findById("123456_1")).thenReturn(Optional.of(song01new));
        Mockito.when(repo.save(song01edited)).thenReturn(song01edited);

        songBookService.createSong(song01new);
        songBookService.editSong(song01new.id, song01edited);

        // when
        Optional<Song> actual = songBookService.editSong("123456_1", song01edited);

        // then
        Assertions.assertThat(actual).contains(song01edited);
    }

    @Test
    void retrieveAllSongs() {
        SongsRepository repo = Mockito.mock(SongsRepository.class);
        SongBookService songBookService = new SongBookService(repo);

        Song song01 = new Song("testSong 1", "Alphonse");
        song01.id = "123456_1";
        Song song02 = new Song("testSong 2", "Bertrand");
        song02.id = "123456_2";
        Song song03 = new Song("testSong 1", "Claude");
        song03.id = "123456_3";

        List<Song> songList = List.of(song01, song02, song03);
        List<Song> songListX = List.of(song01, song03);

        Mockito.when(repo.findAll()).thenReturn(songList);

        // when
        List<Song> actual = songBookService.getAllSongs();

        // then
        Assertions.assertThat(actual).isEqualTo(songListX);
    }

}
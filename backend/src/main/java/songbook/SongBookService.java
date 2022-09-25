package songbook;

import org.springframework.stereotype.Service;
import songbook.models.Song;

import java.util.Optional;

@Service
public class SongBookService {

    private final SongsRepository songsRepository;

    public SongBookService(SongsRepository songsRepository) {
        this.songsRepository = songsRepository;
    }

    public Song createSong(Song song) {
        return songsRepository.save(song);
    }

    public void deleteSong(String id) {
        var item = songsRepository.findById(id);
        if (item.isEmpty()) {
            throw new RuntimeException("The has NOT been DELETED: " +
                    "A song with Id no. " + id + " could not be found.");
        } else {
            songsRepository.deleteById(id);
        }
    }

    public Optional<Song> editSong(String id, Song song) {
        var item = songsRepository.findById(id);
        if (item.isEmpty()) {
            throw new RuntimeException("The song has NOT been CHANGED: " +
                    "A song with Id no. " + id + " could not be found.");
        } else {
            return songsRepository.findById(id).map(e -> songsRepository.save(song));
        }
    }


}

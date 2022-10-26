package songbook;

import org.springframework.stereotype.Service;
import songbook.collections.ReferencesRepository;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.exceptions.SongAlreadyExistsException;
import songbook.collections.models.Reference;
import songbook.models.Song;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class SongBookService {

    private final SongsRepository songsRepository;
    private final ReferencesRepository referencesRepository;

    public SongBookService(SongsRepository songsRepository, ReferencesRepository referencesRepository) {
        this.songsRepository = songsRepository;
        this.referencesRepository = referencesRepository;
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

    public List<Song> getAllSongs() {
        return songsRepository.findAll().stream().sorted(Comparator.comparing(Song::getTitle)).toList();
    }

    public Optional<Song> getSingleSong(String id) {
        return songsRepository.findById(id);
    }

    public Song createSongFromReference(String id) {
        Reference reference = referencesRepository.findById(id).orElseThrow(NoSuchIdException::new);
        // check if song already exists

        // versuche: ifPresent()
        if (songsRepository.findByTitle(reference.getTitle()).isPresent()) {
            throw new SongAlreadyExistsException(reference.getTitle());
        } else {
            reference.setHidden(true);
            referencesRepository.save(reference);
        return songsRepository.save(new Song(reference.getTitle(), reference.getAuthor(), reference.getYear()));
        }
    }

}

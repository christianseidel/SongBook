package songbook;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.models.Reference;
import songbook.models.Song;
import songbook.models.SongSheetFile;

import java.util.*;

@Service
public class SongBookService {

    private final SongsRepository songsRepository;
    private final SongCollectionService songCollectionService;
    private final ReferencesRepository referencesRepository;
    private final SongSheetsRepository songSheetsRepository;

    public SongBookService(SongsRepository songsRepository,
                           SongCollectionService songCollectionService,
                           ReferencesRepository referencesRepository,
                           SongSheetsRepository songSheetsRepository) {
        this.songsRepository = songsRepository;
        this.songCollectionService = songCollectionService;
        this.referencesRepository = referencesRepository;
        this.songSheetsRepository = songSheetsRepository;
    }

    public Song createSong(Song song) {
        return songsRepository.save(song);
    }

    public void deleteSong(String id) {
        var item = songsRepository.findById(id);
        if (item.isEmpty()) {
            throw new RuntimeException("This song has NOT been DELETED! " +
                    "A song with Id no. \"" + id + "\" could not be found.");
        } else {
            songsRepository.deleteById(id);
        }
    }

    public Optional<Song> editSong(String id, Song song) {
        var item = songsRepository.findById(id);
        if (item.isEmpty()) {
            throw new RuntimeException("A song with Id no. \"" + id + "\" could not be found. " +
                    "Consequently, your song has not been changed!");
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
        reference.setHidden(true);
        Optional<Song> existingSong = songsRepository.findByTitle(reference.getTitle());
        if (existingSong.isPresent()) {
            Song song = addOneReferenceToSong(existingSong.get(), reference);
            return songsRepository.save(song);
        } else {
            referencesRepository.save(reference);
            Song song = new Song(reference.getTitle(), reference.getAuthor(), reference.getYear());
            song.setReferences(List.of(reference));
            return songsRepository.save(song);
        }
    }

    public Song addOneReferenceToSong(Song song, Reference reference) {
        if (song.getReferences().isEmpty()) {
            song.setReferences(List.of(reference));
        } else {
            song.getReferences().add(reference);
        }
        return song;
    }

    public String unhideAllReferencesOfASong(String id) {
        Optional<Song> lookupResult = songsRepository.findById(id);
        if (lookupResult.isEmpty()) {
            return "A song with id # \"" + id + "\" could not be found.";
        } else {
            Song song = lookupResult.get();
            List<Reference> references = song.getReferences();
            for (Reference ref : references) {
                ref.setTitle(song.getTitle());
                ref.setAuthor(song.getAuthor());
                ref.setYear(song.getYear());
                if (ref.getId() == null) {
                    ref.setId(UUID.randomUUID().toString());
                } else {
                    ref.setHidden(false);
                }
                referencesRepository.save(ref);
            }
            // Todo: updated version to be tested...
            return "All references are reinserted into Reference Index. " +
                    "References with no existing record were created.";
        }
    }

    public String uploadSongSheetFile(MultipartFile file) {
        return songSheetsRepository.save(new SongSheetFile(file)).getId();
    }

    public void deleteSongSheetFile(String fileId) {
        songSheetsRepository.deleteById(fileId);
    }
}

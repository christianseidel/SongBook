package songbook;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.ReferencesRepository;
import songbook.collections.SongCollectionService;
import songbook.exceptions.NoSuchIdException;
import songbook.collections.models.Reference;
import songbook.models.Song;
import songbook.models.SongSheetFileMyVersion;

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

    public void deleteSong(String id, String user) {
        var item = songsRepository.findByIdAndUser(id, user);
        if (item.isEmpty()) {
            throw new RuntimeException("This song has not been deleted! " +
                    "A song with Id no. \"" + id + "\" could not be found.");
        } else {
            songsRepository.deleteById(id);
        }
    }

    public Optional<Song> editSong(String id, Song song, String user) {
        var item = songsRepository.findByIdAndUser(id, user);
        if (item.isEmpty()) {
            throw new RuntimeException("A song with Id no. \"" + id + "\" could not be found. " +
                    "Consequently, your song has not been changed!");
        } else {
            return songsRepository.findByIdAndUser(id, user).map(e -> songsRepository.save(song));
        }
    }

    public List<Song> getAllSongs(String user) {
        return songsRepository.findAll().stream().filter(element -> element.getUser().equals(user)).sorted(Comparator.comparing(Song::getTitle)).toList();
    }

    public Optional<Song> getSingleSong(String id, String user) {
        return songsRepository.findByIdAndUser(id, user);
    }

    public Song createSongFromReference(String id, String user) {
        Reference reference = referencesRepository.findById(id).orElseThrow(NoSuchIdException::new);
        reference.setHidden(true);
        Optional<Song> existingSong = songsRepository.findByTitleAndUser(reference.getTitle(), user);
        if (existingSong.isPresent()) {
            Song song = addOneReferenceToSong(existingSong.get(), reference, user);
            return songsRepository.save(song);
        } else {
            referencesRepository.save(reference);
            Song song = new Song(reference.getTitle(), reference.getAuthor(), reference.getYear());
            song.setReferences(List.of(reference));
            song.setUser(user);
            return songsRepository.save(song);
        }
    }

    public Song addOneReferenceToSong(Song song, Reference reference, String user) {
        if (song.getReferences().isEmpty()) {
            song.setReferences(List.of(reference));
        } else {
            song.getReferences().add(reference);
        }
        return song;
    }

    public String unhideAllReferencesOfASong(String id, String user) {
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
                    ref.setUser(user);
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
        return songSheetsRepository.save(new SongSheetFileMyVersion(file)).getId();
    }

    public void deleteSongSheetFile(String fileId) {
        songSheetsRepository.deleteById(fileId);
    }
}

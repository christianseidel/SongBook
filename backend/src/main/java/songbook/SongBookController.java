package songbook;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.exceptions.SongAlreadyExistsException;
import songbook.models.Song;
import songbook.models.SongsDTO;

import java.util.Optional;

import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/songbook")
@CrossOrigin
public class SongBookController {

    private final SongBookService songBookService;

    public SongBookController(SongBookService songBookService) {
        this.songBookService = songBookService;
    }

    @PostMapping
    public Song createSong(@RequestBody Song song) {
        return songBookService.createSong(song);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable String id) {
        songBookService.deleteSong(id);
    }

    @PutMapping("/{id}")
    public Optional<Song> editSong(@PathVariable String id, @RequestBody Song song) {
        return songBookService.editSong(id, song);
    }

    @GetMapping
    public SongsDTO getAllSongs() {
        return new SongsDTO(songBookService.getAllSongs());
    }

    @GetMapping("/{id}")
    public Optional<Song> getSingleSong(@PathVariable String id) {
        return songBookService.getSingleSong(id);
    }

    @PostMapping("/add/{id}")
    public ResponseEntity<Object> createSongFromReference(@PathVariable String id) {
        try {
            return status(200).body((songBookService.createSongFromReference(id)));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(jsonifyToMessage(e.getMessage()));
        } catch (SongAlreadyExistsException e) {
            return ResponseEntity.status(409).body(jsonifyToMessage(e.getMessage()));
        }
    }

    @PutMapping("/unhideReferences/{songId}")
    public ResponseEntity<String> unhideAllReferences(@PathVariable String songId) {
        return status(200).body(jsonifyToMessage(songBookService.unhideAllReferencesOfASong(songId)));
    }

    private String jsonifyToMessage(String errorMessage) {
        return "{\"message\": \"" + errorMessage + "\"}";
    }
}

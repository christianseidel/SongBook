package songbook;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.exceptions.SongAlreadyExistsException;
import songbook.models.Song;
import songbook.models.SongsDTO;

import java.util.Optional;

import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/songbook")
@CrossOrigin
@RequiredArgsConstructor
public class SongBookController {

    private final SongBookService songBookService;

    @PostMapping
    public Song createSong(@RequestBody Song song) {
        return songBookService.createSong(song);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable String id) {
        songBookService.deleteSong(id);
    }

    // Todo: I need to handle error message: "This file does not have a three-digit file extension."
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

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadSongSheet(@RequestParam("file") MultipartFile file, String id) {
        return ResponseEntity.status(200).body(jsonifyToMessage(songBookService.uploadSongSheet(file, id)));
    }

    private String jsonifyToMessage(String errorMessage) {
        return "{\"message\": \"" + errorMessage + "\"}";
    }
}

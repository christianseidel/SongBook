package songbook;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import songbook.exceptions.NoSuchIdException;
import songbook.exceptions.SongAlreadyExistsException;
import songbook.models.Song;
import songbook.models.SongsDTO;

import java.security.Principal;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/songbook")
@CrossOrigin
@RequiredArgsConstructor
public class SongBookController {

    private final SongBookService songBookService;

    @PostMapping
    public Song createSong(@RequestBody Song song, Principal principal) {
        song.setUser(principal.getName());
        return songBookService.createSong(song);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable String id, Principal principal) {
        try {
            songBookService.deleteSong(id, principal.getName());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    // Todo: I need to handle error message: "This file does not have a three-digit file extension."
    @PutMapping("/{id}")
    public Optional<Song> editSong(@PathVariable String id, @RequestBody Song song, Principal principal) {
        String user = principal.getName();
        song.setUser(user);
        return songBookService.editSong(id, song, user);
    }

    @GetMapping
    public SongsDTO getAllSongs(Principal principal) {
        return new SongsDTO(songBookService.getAllSongs(principal.getName()));
    }

    @GetMapping("/{id}")
    public Optional<Song> getSingleSong(@PathVariable String id, Principal principal) {
        return songBookService.getSingleSong(id, principal.getName());
    }

    @PostMapping("/add/{id}")
    public ResponseEntity<Object> createSongFromReference(@PathVariable String id, Principal principal) {
        try {
            return status(200).body((songBookService.createSongFromReference(id, principal.getName())));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(jsonifyToMessage(e.getMessage()));
        } catch (SongAlreadyExistsException e) {
            return ResponseEntity.status(409).body(jsonifyToMessage(e.getMessage()));
        }
    }

    @PutMapping("/unhideReferences/{songId}")
    public ResponseEntity<String> unhideAllReferences(@PathVariable String songId, Principal principal) {
        return status(200).body(jsonifyToMessage(songBookService.unhideAllReferencesOfASong(songId, principal.getName())));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadSongSheetFile(@RequestParam("file") MultipartFile file) {
        System.out.println("content type: " + file.getContentType() + ", name: "+ file.getOriginalFilename());
        return ResponseEntity.status(200).body(jsonifyToMessage(songBookService.uploadSongSheetFile(file)));
    }

    @DeleteMapping("/upload/{fileId}")
    public void deleteSongSheetFile(@PathVariable String fileId) {
        songBookService.deleteSongSheetFile(fileId);
    }

    // Todo: This should not be here anymore
    private String jsonifyToMessage(String errorMessage) {
        return "{\"message\": \"" + errorMessage + "\"}";
    }
}

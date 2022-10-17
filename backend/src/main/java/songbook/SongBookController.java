package songbook;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import songbook.models.Song;
import songbook.models.SongsDTO;

import java.util.Optional;

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
        System.out.println("-> request received");
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
}

package songbook;

import org.springframework.web.bind.annotation.*;
import songbook.models.Song;

import java.util.Optional;

@RestController
@RequestMapping("api/songbook")
@CrossOrigin
public class SongBookController {

    private final SongBookService songBookService;

    public SongBookController(SongBookService songBookService) {
        this.songBookService = songBookService;
    }

    @GetMapping(path = ("/test"), produces = "text/plain")
    public String test() {
        return "Test erfolgreich!";
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


    Song countryRoads = new Song("Take Me Home, Country Roads");

    // public SongBookService service = new SongBookService();

    String fileName = "serviceTest_twoPerfectLines";

    public void importSongCollection(String fileName) {
        // referencesService.importSongCollection(fileName);
    }
}

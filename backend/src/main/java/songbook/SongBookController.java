package songbook;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/songbook")
@CrossOrigin
public class SongBookController {

    private final SongBookService songBookService;


    public SongBookController(SongBookService songBookService) {
        this.songBookService = songBookService;
    }
}

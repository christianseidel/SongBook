package songbook;

import org.springframework.stereotype.Service;

@Service
public class SongBookService {

    private final SongsRepository songsRepository;

    public SongBookService(SongsRepository songsRepository) {
        this.songsRepository = songsRepository;
    }
}

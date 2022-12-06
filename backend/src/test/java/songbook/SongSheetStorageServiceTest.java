package songbook;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import songbook.songsheets.SongSheetRepository;
import songbook.songsheets.SongSheetStorageService;

import static org.junit.jupiter.api.Assertions.*;

class SongSheetStorageServiceTest {

    private final SongSheetRepository songSheetRepository = Mockito.mock(SongSheetRepository.class);
    private final SongSheetStorageService storageService = new SongSheetStorageService(songSheetRepository);

    @Test
    void shouldSaveSongSheetFile() {

    }


}
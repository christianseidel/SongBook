package songbook;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import songbook.songsheets.SongSheetRepository;
import songbook.songsheets.SongSheetStorageService;
import songbook.songsheets.models.SongSheetFile;

import java.io.*;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

class SongSheetStorageServiceTest {

    private final SongSheetRepository songSheetRepository = Mockito.mock(SongSheetRepository.class);
    private final SongSheetStorageService storageService = new SongSheetStorageService(songSheetRepository);

    @Test
    void shouldSaveSongSheetFile() {

        try {
            // standard path to be used with regular unit test
            String fileOrigin = "src\\test\\resources\\songSheets\\mockSongSheet.pdf";
            MultipartFile testFile = new MockMultipartFile("mock.pdf", "mockSongSheet.pdf", "application/pdf", new FileInputStream(fileOrigin));
            storageService.saveSongSheetFile(testFile);
            System.out.println("I am in try");
        } catch (IOException e) {
            try {
            // alternative path to be used with unit test on GitHub Actions
                String fileOrigin = "src/test/resources/songSheets/mockSongSheet.pdf";
                MultipartFile testFile = new MockMultipartFile("mock.pdf", "mockSongSheet.pdf", "application/pdf", new FileInputStream(fileOrigin));
                System.out.println("I am in catch");
                storageService.saveSongSheetFile(testFile);
            } catch (IOException ex) {
                System.out.println(ex.getMessage());
            }
        }

        verify(songSheetRepository).save(any(SongSheetFile.class));
    }

    @Test
    void shouldRetrieveSongSheetFile() {

        SongSheetFile testFile = new SongSheetFile();
        Mockito.when(songSheetRepository.findByFileName("/mockURL/mockSongSheet.pdf")).thenReturn(Optional.of(testFile));

        SongSheetFile actual = storageService.retrieveSongSheetFile("/mockURL/mockSongSheet.pdf");

        Assertions.assertEquals(testFile, actual);
    }

    @Test
    void shouldThrowExceptionWhenLookingUpNonExistingSongSheetFile() {

        Mockito.when(songSheetRepository.findByFileName("/mockURL/mockSongSheet.pdf")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class,
                () -> {
                    storageService.retrieveSongSheetFile("/mockURL/mockSongSheet.pdf");
                });
        assertEquals("RuntimeException", exception.getClass().getSimpleName());
        assertEquals("Server is unable to find your song sheet.", exception.getMessage());
    }

    @Test
    @Disabled
    void shouldDeleteSongSheetFile() {

        Mockito.when(songSheetRepository.findByFileName("/mockURL/mockSongSheet.pdf")).thenReturn(Optional.empty());

        verify(songSheetRepository).deleteById("123456");
    }

}
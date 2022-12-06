package songbook;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import songbook.exceptions.EmptyFileException;
import songbook.exceptions.ErrorMessage;
import songbook.exceptions.NoSuchIdException;
import songbook.models.SongSheet;
import songbook.models.SongSheetFileMyVersion;
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

        String fileOrigin = "src\\test\\resources\\songSheets\\mockSongSheet.pdf";
        /*SongSheetFile testFile = new SongSheetFile();
        testFile.setFileName("mockSongSheet.pdf");
        testFile.setFile(fileOrigin.getBytes());
*/
        /*Mockito.when(songSheetRepository.findByFileName("mockSongSheet.pdf")).thenReturn(Optional.empty());*/

        try {
            MultipartFile testFile = new MockMultipartFile("mock.pdf", "mockSongSheet.pdf", "application/pdf", new FileInputStream(fileOrigin));
            storageService.saveSongSheetFile(testFile);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        verify(songSheetRepository).save(any(SongSheetFile.class));
    }

    @Test
    void shouldDeliverSongSheetFile() {

        String fileOrigin = "src\\test\\resources\\songSheets\\mockSongSheet.pdf";
        SongSheetFile testFile = new SongSheetFile();
        testFile.setFileName("/mockURL/mockSongSheet.pdf");
        testFile.setFile(fileOrigin.getBytes());
        Mockito.when(songSheetRepository.findByFileName("/mockURL/mockSongSheet.pdf")).thenReturn(Optional.of(testFile));

        SongSheetFile actual = storageService.retrieveSongSheetFile("/mockURL/mockSongSheet.pdf");

        Assertions.assertEquals(testFile, actual);
    }

    @Test
    void shouldThrowExceptionWhenLookingUpSongSheetFile() {

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
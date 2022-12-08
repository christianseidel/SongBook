package songbook;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
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
    private final SongSheetStorageService songSheetStorageService = new SongSheetStorageService(songSheetRepository);

    @Test
    @DisplayName("song sheet file gets saved")
    void shouldSaveSongSheetFile() {

        String fileOrigin = "src/test/resources/songSheets/mockSongSheet.pdf";
        try {
            MultipartFile testFile = new MockMultipartFile("mock.pdf", "mockSongSheet.pdf", "application/pdf", new FileInputStream(fileOrigin));
            songSheetStorageService.saveSongSheetFile(testFile);
        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }

        verify(songSheetRepository).save(any(SongSheetFile.class));
    }

    @Test
    @DisplayName("song sheet file already exists three times")
    void shouldSaveSongSheetFileWithNameExtendedByCounterThreeWhenFileAlreadyExistsThreeTimes() {

        String fileOrigin = "src/test/resources/songSheets/mockSongSheet.pdf";
        SongSheetFile testFile = new SongSheetFile();
        Mockito.when(songSheetRepository.findByFileName("mockSongSheet.pdf")).thenReturn(Optional.of(testFile));
        Mockito.when(songSheetRepository.findByFileName("mockSongSheet_1.pdf")).thenReturn(Optional.of(testFile));
        Mockito.when(songSheetRepository.findByFileName("mockSongSheet_2.pdf")).thenReturn(Optional.of(testFile));
        SongSheetFile fileCreated = new SongSheetFile();
        fileCreated.setFileName("mockSongSheet_3.pdf");
        Mockito.when(songSheetRepository.save(any(SongSheetFile.class))).thenReturn(fileCreated);

        try {
            MultipartFile testMultiPartFile = new MockMultipartFile("mock.pdf", "mockSongSheet.pdf", "application/pdf", new FileInputStream(fileOrigin));
            SongSheetFile fileReturned = songSheetStorageService.saveSongSheetFile(testMultiPartFile);

            verify(songSheetRepository).findByFileName("mockSongSheet.pdf");
            verify(songSheetRepository).findByFileName("mockSongSheet_1.pdf");
            verify(songSheetRepository).findByFileName("mockSongSheet_2.pdf");
            verify(songSheetRepository).findByFileName("mockSongSheet_3.pdf");
            verify(songSheetRepository).save(any(SongSheetFile.class));
            Assertions.assertEquals("mockSongSheet_3.pdf", fileReturned.getFileName());

        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }
    }

    @Test
    @DisplayName("song sheet file is returned")
    void shouldRetrieveSongSheetFile() {

        SongSheetFile testFile = new SongSheetFile();
        Mockito.when(songSheetRepository.findByFileName("/mockURL/mockSongSheet.pdf")).thenReturn(Optional.of(testFile));

        SongSheetFile actual = songSheetStorageService.retrieveSongSheetFile("/mockURL/mockSongSheet.pdf");

        Assertions.assertEquals(testFile, actual);
    }

    @Test
    @DisplayName("song sheet file cannot be found")
    void shouldThrowExceptionWhenLookingUpNonExistingSongSheetFile() {

        Mockito.when(songSheetRepository.findByFileName("/mockURL/mockSongSheet.pdf")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class,
                () -> {
                    songSheetStorageService.retrieveSongSheetFile("/mockURL/mockSongSheet.pdf");
                });
        assertEquals("RuntimeException", exception.getClass().getSimpleName());
        assertEquals("Server is unable to find your song sheet.", exception.getMessage());
    }

    @Test
    @DisplayName("song sheet file gets deleted")
    void shouldDeleteSongSheetFile() {

        SongSheetFile testFile = new SongSheetFile();
        Mockito.when(songSheetRepository.findById("f566g789")).thenReturn(Optional.of(testFile));

        songSheetStorageService.deleteSongSheetFile("f566g789");

        verify(songSheetRepository).deleteById("f566g789");
    }

    @Test
    @DisplayName("song sheet file to be deleted cannot be found")
    void shouldThrowErrorMessageWhenTryingToDeleteNonExistingSongSheetFile() {

        Mockito.when(songSheetRepository.findById("f566g789")).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            songSheetStorageService.deleteSongSheetFile("f566g789");
        });

        assertEquals("Song sheet file with Id No. \"f566g789\" could not be found.", exception.getMessage());

    }
}
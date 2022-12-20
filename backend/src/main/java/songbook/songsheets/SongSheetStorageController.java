package songbook.songsheets;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import songbook.exceptions.SongBookMessage;
import songbook.songsheets.models.SongSheetUploadResponse;
import songbook.songsheets.models.SongSheetFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/sheets")
@CrossOrigin
public class SongSheetStorageController {

    private final SongSheetStorageService songSheetStorageService;

    public SongSheetStorageController(SongSheetStorageService songSheetStorageService) {
        this.songSheetStorageService = songSheetStorageService;
    }

    @PostMapping("/upload")
    ResponseEntity<Object> uploadSongSheetFile(@RequestParam("file") MultipartFile file) {
        try {
            SongSheetFile songSheetFile = songSheetStorageService.saveSongSheetFile(file);
            return ResponseEntity.ok().body(new SongSheetUploadResponse(songSheetFile.getId(), songSheetFile.getFileName(), file.getContentType()));
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.status(406).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    ResponseEntity<Object> downloadSongSheetFile(@PathVariable String id) {
        try {
            SongSheetFile file = songSheetStorageService.retrieveSongSheetFile(id);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; fileName=" + file.getFileName())
                    .body(file.getFile());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    void deleteSongSheetFile(@PathVariable String id) {
        songSheetStorageService.deleteSongSheetFile(id);
    }
}

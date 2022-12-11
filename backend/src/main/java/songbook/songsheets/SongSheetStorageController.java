package songbook.songsheets;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import songbook.exceptions.SongBookMessage;
import songbook.songsheets.models.SongSheetUploadResponse;
import songbook.songsheets.models.SongSheetFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/api/sheets")
@CrossOrigin
public class SongSheetStorageController {

    private final SongSheetStorageService songSheetStorageService;

    public SongSheetStorageController(SongSheetStorageService songSheetStorageService) {
        this.songSheetStorageService = songSheetStorageService;
    }

    @PostMapping("/upload")
    ResponseEntity<Object> uploadSongSheetFile(@RequestParam("file") MultipartFile file) throws IOException {
        try {
            SongSheetFile songSheetFile = songSheetStorageService.saveSongSheetFile(file);
            String contentType = file.getContentType();
            String name = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/sheets/download/")
                    .path(songSheetFile.getFileName())
                    .toUriString();
            return ResponseEntity.ok().body(new SongSheetUploadResponse(songSheetFile.getFileName(), contentType, songSheetFile.getId(), url));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @GetMapping("/download/{fileName}")
    ResponseEntity<Object> downloadSongSheetFile(@PathVariable String fileName, HttpServletRequest request) {
        try {
            SongSheetFile file = songSheetStorageService.retrieveSongSheetFile(fileName);
            String mimeType= request.getServletContext().getMimeType(file.getFileName());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline;fileName=" + file.getFileName())
                    .body(file.getFile());
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    void deleteSongSheetFile(@PathVariable String id) {
        songSheetStorageService.deleteSongSheetFile(id);
    }
}

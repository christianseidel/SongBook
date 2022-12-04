package songbook.songsheets;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import songbook.songsheets.models.SongSheetUploadResponse;
import songbook.songsheets.models.SongSheetFile;

import javax.servlet.http.HttpServletRequest;
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
    SongSheetUploadResponse uploadSongSheetFile(@RequestParam("file") MultipartFile file) throws IOException {
        SongSheetFile songSheetFile = songSheetStorageService.saveSongSheetFile(file);
        String contentType = file.getContentType();
        String name = StringUtils.cleanPath(file.getOriginalFilename());
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/sheets/download/")
                .path(name)
                .toUriString();
        return new SongSheetUploadResponse(songSheetFile.getFileName(), contentType, songSheetFile.getId(), url);
    }

    @GetMapping("/download/{fileName}")
    ResponseEntity<byte[]> downloadSongSheetFile(@PathVariable String fileName, HttpServletRequest request) {
        SongSheetFile file = songSheetStorageService.retrieveSongSheetFile(fileName);
        String mimeType= request.getServletContext().getMimeType(file.getFileName());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;fileName=" + file.getFileName())
                .body(file.getFile());
    }

    @DeleteMapping("{id}")
    void deleteSongSheetFile(@PathVariable String id) {
        songSheetStorageService.deleteSongSheetFile(id);
    }
}

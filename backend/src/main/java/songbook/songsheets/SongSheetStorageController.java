package songbook.songsheets;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import songbook.songsheets.models.SongSheetUploadResponse;
import songbook.songsheets.models.SongSheetFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api/sheets")
@CrossOrigin
public class SheetUploadController {

    private SongSheetRepository songSheetRepository;

    public SheetUploadController(SongSheetRepository songSheetRepository) {
        this.songSheetRepository = songSheetRepository;
    }

    @PostMapping("/upload")
    SongSheetUploadResponse uploadSongSheet(@RequestParam("file") MultipartFile file) throws IOException {

        String name = StringUtils.cleanPath(file.getOriginalFilename());
        SongSheetFile songSheetFile = new SongSheetFile();
        songSheetFile.setFileName(name);
        songSheetFile.setFile(file.getBytes());

        songSheetRepository.save(songSheetFile);


        String contentType = file.getContentType();

        SongSheetUploadResponse response = new SongSheetUploadResponse(name, contentType, songSheetFile.getId());

        return response;
    }

    @GetMapping("/download")
    ResponseEntity<byte[]> downloadSongSheet(@PathVariable String fileName, HttpServletRequest request) {

        SongSheetFile sheet = songSheetRepository.findByFileName(fileName);

        String mimeType= request.getServletContext().getMimeType(sheet.getFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline;fileName=" + sheet.getFileName())
                .body(sheet.getFile());
    }
}

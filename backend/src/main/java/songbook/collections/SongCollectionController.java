package songbook.collections;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import songbook.collections.models.Reference;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin
@RequiredArgsConstructor
public class SongCollectionController {

    private final SongCollectionService songCollectionService;

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<NewSongCollection> uploadCollection(@RequestParam("file") MultipartFile file) throws IOException {

        // HINT
        System.out.println("\n-> Received file \"" + file.getOriginalFilename()
                + "\" with Content Type: \"" + file.getContentType() + "\"");
        // String feedbackJSONfied = "{\"message\": \"" + feedback + "\"}";

        return new ResponseEntity<>(songCollectionService.processMultipartFile(file), HttpStatus.CREATED);
    }

    @PostMapping
    public Reference createReference(@RequestBody Reference reference) {
        return songCollectionService.createReference(reference);
    }

    @DeleteMapping(path = "/{id}")
    public void deleteReference(@PathVariable String id) {
        try {
            songCollectionService.deleteReference(id);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(path = "/{id}")
    public Optional<Reference> editReference(@PathVariable String id, @RequestBody Reference reference) {
        return songCollectionService.editReference(id, reference);
    }
}

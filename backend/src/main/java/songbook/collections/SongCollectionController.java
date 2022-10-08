package songbook.collections;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import songbook.SongBookController;
import songbook.collections.exceptions.MalformedFileException;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferencesDTO;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.ResponseEntity.status;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin
public class SongCollectionController {

    private final SongCollectionService songCollectionService;

    public SongCollectionController(SongCollectionService songCollectionService) {
        this.songCollectionService = songCollectionService;
    }

    @GetMapping
    public ResponseEntity<ReferencesDTO> getAllReferences(){
        return status(200).body((songCollectionService.getAllReferences()));
    }

    @GetMapping(path = "/{title}")
    public ResponseEntity<ReferencesDTO> getReferencesByTitle(@PathVariable String title){
        return status(200).body((songCollectionService.getReferencesByTitle(title)));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadCollection(@RequestParam("file") MultipartFile file) throws IOException {

        // HINT
        System.out.println("\n-> Received file \"" + file.getOriginalFilename()
                + "\" with Content Type: \"" + file.getContentType() + "\"");

        try {
            return new ResponseEntity<>(songCollectionService.processMultipartFile(file), HttpStatus.OK);
        } catch (MalformedFileException e) {
            return ResponseEntity.status(406).body(errorJSONfied(e.getMessage()));
        }

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

    private String errorJSONfied(String errorMessage) {
        return "{\"message\": \"" + errorMessage + "\"}";
    }
}

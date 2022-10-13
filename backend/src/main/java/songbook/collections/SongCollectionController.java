package songbook.collections;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import songbook.collections.exceptions.NoSuchIdException;
import songbook.collections.exceptions.MalformedFileException;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferencesDTO;

import java.io.IOException;

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

    @GetMapping("/{title}")
    public ResponseEntity<ReferencesDTO> getReferencesByTitle(@PathVariable String title){
        return status(200).body((songCollectionService.getReferencesByTitle(title)));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadCollection(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("\n-> Received file \"" + file.getOriginalFilename()
                + "\" with Content Type: \"" + file.getContentType() + "\"");
        try {
            return new ResponseEntity<>(songCollectionService.processMultipartFileUpload(file), HttpStatus.OK);
        } catch (MalformedFileException e) {
            return ResponseEntity.status(406).body(stringToJson(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(stringToJson(e.getMessage()));
    }
}

    @PostMapping("/upload")
    public Reference createReference(@RequestBody Reference reference) {
        return songCollectionService.createReference(reference);
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<Object> getReferenceById(@PathVariable String id){
        try {
            return status(200).body((songCollectionService.getReferenceById(id)));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(stringToJson(e.getMessage()));
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ReferencesDTO> copyReferenceById(@PathVariable String id){
        return status(200).body((songCollectionService.copyReferenceById(id)));
    }

    @DeleteMapping("/edit/{id}")
    public ResponseEntity<String> deleteReference(@PathVariable String id) {
        try {
            songCollectionService.deleteReference(id);
            return ResponseEntity.ok(stringToJson("Your reference was deleted."));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(stringToJson(e.getMessage()));
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Object> editReference(@PathVariable String id, @RequestBody Reference reference) {
        try {
            return new ResponseEntity<>(songCollectionService.editReference(id, reference), HttpStatus.OK);
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(stringToJson(e.getMessage()));
        }
    }

    private String stringToJson(String errorMessage) {
        return "{\"message\": \"" + errorMessage + "\"}";
    }
}

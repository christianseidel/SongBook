package songbook.collections;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import songbook.exceptions.SongBookMessage;
import songbook.exceptions.NoSuchIdException;
import songbook.exceptions.MalformedFileException;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferencesDTO;

import java.io.IOException;
import java.security.Principal;
import java.util.Objects;

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
    public ResponseEntity<ReferencesDTO> getAllReferences(Principal principal){
        return status(200).body((songCollectionService.getAllReferences(principal.getName())));
    }

    @GetMapping("/{title}")
    public ResponseEntity<ReferencesDTO> getReferencesByTitle(@PathVariable String title, Principal principal){
        return status(200).body((songCollectionService.getReferencesByTitle(title, principal.getName())));
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadCollection(@RequestParam("file") MultipartFile file, Principal principal) {
        System.out.println("\n-> Received file \"" + file.getOriginalFilename()
                + "\" with Content Type: \"" + file.getContentType() + "\"");
        try {
            return new ResponseEntity<>(songCollectionService.processCollectionUpload(file, principal.getName()), HttpStatus.CREATED);
        } catch (MalformedFileException e) { // wrong file encoding
            return ResponseEntity.status(406).body(SongBookMessage.jsonify(e.getMessage()));
        } catch (RuntimeException e) {
            System.out.println("ups: RuntimeException...");
            return ResponseEntity.status(500).body(SongBookMessage.jsonify(e.getMessage()));
        } catch (IOException e) {  // could not create directory
            System.out.println("ups: Input/OutputException...");
            return ResponseEntity.status(500).body(SongBookMessage.jsonify(e.getMessage() + " (" + e.getClass().getSimpleName() + ")"));
        } catch (Exception e) {
            System.out.println("References File Upload produced exception with error code: " + e.getClass() + ".");
        }
    }


    @PostMapping("/upload")
    public Reference createReference(@RequestBody Reference reference, Principal principal) {
        reference.setUser(principal.getName());
        return songCollectionService.createReference(reference);
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<Object> getReferenceById(@PathVariable String id){
        try {
            return status(200).body((songCollectionService.getReferenceById(id)));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<ReferencesDTO> copyReferenceById(@PathVariable String id){
        System.out.println("püht");
        return status(200).body((songCollectionService.copyReferenceById(id)));
    }

    @DeleteMapping("/edit/{id}")
    public ResponseEntity<String> deleteReference(@PathVariable String id) {
        try {
            songCollectionService.deleteReference(id);
            return ResponseEntity.ok(SongBookMessage.jsonify("Your reference was deleted."));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Object> editReference(@PathVariable String id, @RequestBody Reference reference) {
        try {
            return new ResponseEntity<>(songCollectionService.editReference(id, reference), HttpStatus.OK);
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @PutMapping("/edit/hide/{id}")
    public ResponseEntity<Object> hideReference(@PathVariable String id) {
        try {
            songCollectionService.hideReference(id);
            return ResponseEntity.ok().build();
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @PutMapping("/edit/unhide/{id}")
    public ResponseEntity<Object> unhideReference(@PathVariable String id) {
        try {
            songCollectionService.unhideReference(id);
            return ResponseEntity.ok(SongBookMessage.jsonify("Your reference now is no longer HIDDEN."));
        } catch (NoSuchIdException e) {
            return ResponseEntity.status(404).body(SongBookMessage.jsonify(e.getMessage()));
        }
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        if (e.getMessage().startsWith("JSON parse error: Cannot deserialize value of type `int` from String")) {
            return ResponseEntity.status(406).body(SongBookMessage.jsonify("The server received invalid data. " +
                    "Please ensure that all numbers are entered in a number format."));
        } else {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

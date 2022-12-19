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
    String fileName = "";
    long lastTimeReceived = System.currentTimeMillis();
    long idleTimeNeeded = 60_000 * 5;
    boolean skipThisTime = false;
    boolean breakLoop = false;

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

        // make sure the same file does not get processed a second time, when the first time is still running.
        if (fileName != "" && !Objects.equals(file.getOriginalFilename(), fileName)) {
            breakLoop = true;
        }

        long sinceLastTimeReceived = System.currentTimeMillis() - lastTimeReceived;
        if ((Objects.equals(file.getOriginalFilename(), fileName)) && (sinceLastTimeReceived < idleTimeNeeded)) {
            System.out.println("\nThis file name \"" + file.getOriginalFilename() + "\" and the file name of");
            System.out.println("the file last received \"" + fileName + "\" are equal (" + (Objects.equals(file.getOriginalFilename(), fileName)) + ").");
            System.out.println("\nAnd the time since you last uploaded this file amounts to " + sinceLastTimeReceived + " milliseconds and");
            System.out.println("therefore is smaller than the requested idle time of " + idleTimeNeeded + " milliseconds " +
                    "(" + (sinceLastTimeReceived < idleTimeNeeded) + ").\n");
            skipThisTime = true;
        }

        if (!skipThisTime) {
            try {
                fileName = file.getOriginalFilename();
                lastTimeReceived = System.currentTimeMillis();
                return new ResponseEntity<>(songCollectionService.processCollectionUpload(file, principal.getName()), HttpStatus.CREATED);
            } catch (MalformedFileException e) { // wrong file encoding
                return ResponseEntity.status(406).body(SongBookMessage.jsonify(e.getMessage()));
            } catch (RuntimeException e) {
                return ResponseEntity.status(500).body(SongBookMessage.jsonify(e.getMessage()));
            } catch (IOException e) {  // could not create directory
                return ResponseEntity.status(500).body(SongBookMessage.jsonify(e.getMessage() + " (" + e.getClass().getSimpleName() + ")"));
            }
        } else {
            System.out.println("Therefor your request got ignored.");
            long minuteCounter = 1;
            while (sinceLastTimeReceived < idleTimeNeeded && breakLoop) {
                sinceLastTimeReceived = System.currentTimeMillis() - lastTimeReceived;
                if (sinceLastTimeReceived - (minuteCounter * 1000 * 60) > 1000 * 60) {
                    if (minuteCounter == 1) {
                        System.out.println(1 + " minute has past.");
                    } else {
                        System.out.println(minuteCounter + " minutes have past.");
                    }
                    ++minuteCounter;
                }
            }
            System.out.println("While loop ended.");
            skipThisTime = false;
            return status(207).body(SongBookMessage.jsonify("Your request was sent twice. The first time should have been processed fine."));
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

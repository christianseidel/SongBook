package songbook.collections;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin
public class SongCollectionController {

    private final SongCollectionService songCollectionService;

    public SongCollectionController(SongCollectionService songCollectionService) {
        this.songCollectionService = songCollectionService;
    }

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadCollection(@RequestParam("file") MultipartFile file) throws IOException {




        System.out.println("\nReceived file with Content Type: \"" + file.getContentType() + "\"");
        System.out.println("and File Name: \"" + file.getName() + "\"");
        System.out.println("and from Class: \"" + file.getClass().getSimpleName() + "\"");

        songCollectionService.processMultipartFile(file);


/*
        try {
            System.out.println("bis hier her");
            List<String> s = Files.readAllLines(file);
        } catch (IOException e) {
            System.out.println("Cannot read this file.");
        }

 */
       // System.out.println("s");
        /*
        try {
            Files.copy(file, temporaryDirectory, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            System.out.println("Could not save file!");
        }
*/

/*
            storageService.store(file);
            redirectAttributes.addFlashAttribute("message",
                    "You successfully uploaded " + file.getOriginalFilename() + "!");

            return "redirect:/";
        }
*/

        /*
        try {
            Files.delete(temporaryDirectory);
            System.out.println("Temporary directory deleted.");
        } catch (IOException e) {
            throw new RuntimeException("Unable to delete temporary song collection directory");
        }
*/
        String response = "Es wurden alle 300 von 300 Einträgen eingelesen";

    return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

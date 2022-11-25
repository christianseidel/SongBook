package songbook.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "SongSheetFiles")
@Data
public class SongSheetFile {

    @Id
    private String id;
    private String fileName;
    // private MultipartFile file;

    public SongSheetFile(MultipartFile file) {
        this.fileName = file.getOriginalFilename();
       // this.file = file;
    }
}

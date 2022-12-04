package songbook.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "SongSheetFiles")
@Data
public class SongSheetFileMyVersion {

    @Id
    private String id;
    private String fileName;
    // private MultipartFile file;

    public SongSheetFileMyVersion(MultipartFile file) {
        this.fileName = file.getOriginalFilename();
       // this.file = file;
    }
}

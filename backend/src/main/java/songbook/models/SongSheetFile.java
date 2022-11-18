package songbook.models;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "SongSheetFiles")
@Data
public class SongSheetFile {

    private MultipartFile file;
    private String id;

    public SongSheetFile(MultipartFile file, String id) {
        this.file = file;
        this.id = id;
    }
}

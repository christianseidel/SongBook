package songbook.songsheets.models;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class SongSheet {

    @Id
    private String name;
    private String source;
    private String description;
    private String key;
    private String fileId;
    private String fileName;
    private String fileUrl;
    private String dateUploaded;

    public SongSheet (String name, String source, String description, String key, String fileId, String fileName, String fileUrl) {
        this.name = name;
        this.source = source;
        this.description = description;
        this.key = key;
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
    }
}

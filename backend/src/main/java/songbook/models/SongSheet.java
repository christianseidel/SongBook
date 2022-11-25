package songbook.models;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Data
public class SongSheet {

    @Id
    private String id;
    private String name;
    private String source;
    private String description;
    private String key;
    private String dateUploaded;

    public SongSheet (String name, String source, String description, String key) {
        this.name = name;
        this.source = source;
        this.description = description;
        this.key = key;
    }
}

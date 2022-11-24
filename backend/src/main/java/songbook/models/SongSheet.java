package songbook.models;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SongSheet {
    private String name;
    private String source;
    private String description;
    private String key;
    private String fileName;
    private LocalDate dateUploaded;

    public SongSheet (String name, String source, String description, String key, String fileName) {
        System.out.println("File Title: " + name + ", File Name: " + fileName);
        this.name = name;
        this.source = source;
        this.description = description;
        this.key = key;
        this.fileName = UniformFileName.create(fileName);
        this.dateUploaded = LocalDate.now();
    }
}

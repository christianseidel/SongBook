package songbook.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.UUID;

@Document (collection = "Songs")
@Data
@NoArgsConstructor
public class Song {

    @Id
    public String id;
    public String title;
    public String author;
    private LocalDate dateCreated;

    // public List<ReferenceRetained> references = new ArrayList<>();

    public Song(String title) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.dateCreated = LocalDate.now();
    }

    public Song(String title, String author) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.author = author;
        this.dateCreated = LocalDate.now();
    }

}

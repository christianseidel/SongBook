package songbook.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document (collection = "Songs")
@Data
@NoArgsConstructor
public class Song {

    @Id
    public String id;
    public String title;
    public String author;
    // public List<ReferenceRetained> references = new ArrayList<>();

    // @Todo add date

    public Song(String title) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
    }

    public Song(String title, String author) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.author = author;
    }

}

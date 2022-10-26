package songbook.collections.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document (collection = "Collections")
@Data
@NoArgsConstructor
public class Reference {

    @Id
    private String id;
    private String title;
    private SongCollection songCollection;
    private int page;
    private String author;
    private int year;
    private boolean hidden;


    public Reference(String title, SongCollection songCollection) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.songCollection = songCollection;
    }

    public Reference(String title, SongCollection songCollection, int page) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.songCollection = songCollection;
        this.page = page;
    }

    public Reference(Reference toCopy) {
        this.id = UUID.randomUUID().toString();
        this.title = toCopy.title;
        this.songCollection = toCopy.songCollection;
        this.page = toCopy.page;
        this.author = toCopy.author;
        this.year = toCopy.year;
    }
}

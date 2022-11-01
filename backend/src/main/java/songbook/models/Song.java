package songbook.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import songbook.collections.models.Reference;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document (collection = "Songs")
@Data
public class Song {

    @Id
    private String id;
    private String title;
    private String author;
    private LocalDate dateCreated;
    private int year; // year of creation of the song
    private String description;
    private List<Reference> references = new ArrayList<>();

    // private List<ReferenceRetained> references = new ArrayList<>();

    public Song() {
        this.id = UUID.randomUUID().toString();
        this.dateCreated = LocalDate.now();
    }

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

    public Song(String title, String author, int yearOfCreation) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.author = author;
        this.year = yearOfCreation;
        this.dateCreated = LocalDate.now();
    }

}

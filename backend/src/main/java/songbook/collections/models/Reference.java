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
    public String id;
    public String title;
    public ReferenceVolume volume;
    public int page;
    public String author;
    public int year;


    public Reference(String title, ReferenceVolume volume) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.volume = volume;
    }

    public Reference(String title, ReferenceVolume volume, int page) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.volume = volume;
        this.page = page;
    }

    public Reference(Reference toCopy) {
        this.id = UUID.randomUUID().toString();
        this.title = toCopy.title;
        this.volume = toCopy.volume;
        this.page = toCopy.page;
        this.author = toCopy.author;
        this.year = toCopy.year;
    }

}

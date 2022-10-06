package songbook.collections.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document (collection = "Collections")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reference {

    @Id
    public String id;
    public String title;
    public ReferenceVolume volume;
    public short page;
    public String author;

    public Reference(String title) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
    }

    public Reference(String title, ReferenceVolume volume) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.volume = volume;
    }

    public Reference(String title, short page) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.page = page;
    }

    public Reference(String title, ReferenceVolume volume, short page) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.volume = volume;
        this.page = page;
    }

}

package songbook.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "Users")
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private LocalDate dateCreated;

    public User (String username, String password) {
        this.username = username;
        this.password = password;
        this.dateCreated = LocalDate.now();
    }
}

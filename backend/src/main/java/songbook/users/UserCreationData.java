package songbook.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationData {

    @Id
    private String id;
    private String username;
    private String password;
    private String passwordAgain;
}

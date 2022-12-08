package songbook.users;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {


    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody UserCreationData userCreationData) {
        return ResponseEntity.status(201).body("everything fine!");
    }
}



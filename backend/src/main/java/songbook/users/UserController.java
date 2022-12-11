package songbook.users;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import songbook.exceptions.NoSuchUserException;
import songbook.exceptions.PasswordsDoNotMatchException;
import songbook.exceptions.SongBookMessage;
import songbook.exceptions.UserAlreadyExistsException;
import songbook.users.authentification.JwtUtils;
import songbook.users.authentification.Token;

import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;


    @PostMapping("/register")
    public ResponseEntity<Object> createUser(@RequestBody UserCreationData userCreationData) {
        try {
            userService.createUser(userCreationData);
            ResponseEntity<Object> responseEntity = loginUser(new UserLoginData(userCreationData.getUsername(), userCreationData.getPassword()));
            if (responseEntity.getStatusCode().value() == 200) {
                return ResponseEntity.status(201).body(responseEntity.getBody());
            } else {
                return responseEntity;
            }
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (PasswordsDoNotMatchException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody UserLoginData userLoginData) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    userLoginData.getUsername(), userLoginData.getPassword()));
            return ResponseEntity.ok(new Token(jwtUtils.createToken(new HashMap<>(), userLoginData.getUsername())));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/info/{username}")
    public String getDateCreated(@PathVariable String username) {
        return SongBookMessage.jsonify(userService.getDateCreated(username));
    }

    @DeleteMapping("/info/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        try {
            userService.deleteUser(username);
        } catch (NoSuchUserException e) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok().build();
    }
}



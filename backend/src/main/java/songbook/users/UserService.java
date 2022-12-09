package songbook.users;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import songbook.exceptions.PasswordsDoNotMatchException;
import songbook.exceptions.UserAlreadyExistsException;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(UserCreationData userCreationData) {
        if (userCreationDataIsValid(userCreationData)) {
            User user = new User(null, userCreationData.getUsername(), passwordEncoder.encode(userCreationData.getPassword()));
            return userRepository.save(user);
        }
        throw new PasswordsDoNotMatchException();
    }

    private boolean userCreationDataIsValid(UserCreationData userCreationData) {
        userRepository.findByUsername(userCreationData.getUsername())
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException();
                });
        return Objects.equals(userCreationData.getPassword(), userCreationData.getPasswordAgain());
    }

    public Optional<User> findByUserName(String username) {
        return userRepository.findByUsername(username);
    }
}

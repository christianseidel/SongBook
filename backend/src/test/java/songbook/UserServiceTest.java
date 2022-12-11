package songbook;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.springframework.security.crypto.password.PasswordEncoder;
import songbook.exceptions.PasswordsDoNotMatchException;
import songbook.exceptions.UserAlreadyExistsException;
import songbook.users.User;
import songbook.users.UserCreationData;
import songbook.users.UserRepository;
import songbook.users.UserService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

class UserServiceTest {

    @Test
    @DisplayName("user gets created")
    void shouldCreateUser() {
        // given
        UserCreationData newUserCreationData = new UserCreationData(null, "Cynthia", "cyn2cyn", "cyn2cyn");
        User user = new User(null, "Cynthia", "SomePerfectlySecureHash");
        User savedUser = new User("654654654", "Cynthia", "SomePerfectlySecureHash");

        UserRepository repo = mock(UserRepository.class);
        when(repo.save(user)).thenReturn(savedUser);

        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("cyn2cyn")).thenReturn("SomePerfectlySecureHash");

        // when
        UserService userService = new UserService(repo, passwordEncoder);
        User actual = userService.createUser(newUserCreationData);

        // then
        assertThat(actual).isEqualTo(savedUser);
    }

    @Test
    @DisplayName("passwords do not match")
    void shouldNotCreateUserForPasswordsDoNotMatch() {
        // given
        UserCreationData newUser = new UserCreationData();
        newUser.setUsername("Joey");
        newUser.setPassword("MyJoeyPassword");
        newUser.setPasswordAgain("JoeyDoesntRememberPwd");

        UserRepository repo = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // when
        UserService userService = new UserService(repo, passwordEncoder);

        // then
        assertThatExceptionOfType(PasswordsDoNotMatchException.class)
                .isThrownBy(()-> userService.createUser(newUser))
                .withMessage("Passwords do not match.");
    }

    @Test
    @DisplayName("user already exists")
    void shouldNotCreateUserForUserAlreadyExists() {
        // given
        UserCreationData newUser = new UserCreationData();
        newUser.setUsername("Alice");
        newUser.setPassword("RabbitHole01");
        newUser.setPasswordAgain("RabbitHole01");
        User existingUser = new User("123456789", "Fox", "RabbitHole02");

        UserRepository repo = Mockito.mock(UserRepository.class);
        when(repo.findByUsername("Alice")).thenReturn(Optional.of(existingUser));

        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("123456789")).thenReturn("BestSecuredPassword");

        // when
        UserService userService = new UserService(repo, passwordEncoder);

        // then
        assertThatExceptionOfType(UserAlreadyExistsException.class)
                .isThrownBy(() -> userService.createUser(newUser))
                .withMessage("Chosen user name already exists.");
    }

}
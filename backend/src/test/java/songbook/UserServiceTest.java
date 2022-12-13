package songbook;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.springframework.security.crypto.password.PasswordEncoder;
import songbook.exceptions.NoSuchUserException;
import songbook.exceptions.PasswordsDoNotMatchException;
import songbook.exceptions.UserAlreadyExistsException;
import songbook.users.User;
import songbook.users.UserCreationData;
import songbook.users.UserRepository;
import songbook.users.UserService;

import java.lang.reflect.InvocationTargetException;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

class UserServiceTest {

    @Test
    @DisplayName("user created")
    void shouldCreateUser() {
        // given
        UserCreationData newUserCreationData = new UserCreationData(null, "Cynthia", "cyn2cyn", "cyn2cyn");
        User user = new User("Cynthia", "SomePerfectlySecureHash");
        User savedUser = new User("Cynthia", "SomePerfectlySecureHash");

        UserRepository userRepository = mock(UserRepository.class);
        when(userRepository.save(user)).thenReturn(savedUser);

        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("cyn2cyn")).thenReturn("SomePerfectlySecureHash");

        // when
        UserService userService = new UserService(userRepository, passwordEncoder);
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

        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

        // when
        UserService userService = new UserService(userRepository, passwordEncoder);

        // then
        assertThatExceptionOfType(PasswordsDoNotMatchException.class)
                .isThrownBy(() -> userService.createUser(newUser))
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
        User existingUser = new User("Fox", "RabbitHole02");

        UserRepository userRepository = Mockito.mock(UserRepository.class);
        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(existingUser));

        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("123456789")).thenReturn("BestSecuredPassword");

        // when
        UserService userService = new UserService(userRepository, passwordEncoder);

        // then
        assertThatExceptionOfType(UserAlreadyExistsException.class)
                .isThrownBy(() -> userService.createUser(newUser))
                .withMessage("Chosen user name already exists.");
    }

    @Test
    @DisplayName("retrieved user account creation date")
    void shouldFetchUserAccountCreationDate() {
        // given
        User user = new User("Alice", "RabbitHole00");
        user.setId("555666777");
        user.setDateCreated(LocalDate.of(2022, 12, 11));

        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("555666777")).thenReturn("PrimeSecuredPassword");
        UserService userService = new UserService(userRepository, passwordEncoder);

        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(user));

        // when
        String actual = userService.getDateCreated("Alice");

        // then
        Assertions.assertEquals("2022-12-11", actual);
    }

    @Test
    @DisplayName("user not found when trying to retrieve creation date")
    void shouldThrowErrorWhenTryingToFetchCreationDateOfNonExistingUser() {

        // given
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        UserService userService = new UserService(userRepository, passwordEncoder);

        when(userRepository.findByUsername("Santa")).thenReturn(Optional.empty());

        // then
        Exception exception = assertThrows(NoSuchUserException.class, () ->
                userService.getDateCreated("Santa"));
        assertEquals("Server is unable to find this username.",
                exception.getMessage());
    }

    @Test
    @DisplayName("user deleted")
    void shouldDeleteUser() {

        // given
        User existingUser = new User("Alice", "RabbitHole03");
        existingUser.setId("123456789");

        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        UserService userService = new UserService(userRepository, passwordEncoder);

        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(existingUser));

        // when
        userService.deleteUser("Alice");

        // then
        Mockito.verify(userRepository).deleteById("123456789");
    }

    @Test
    @DisplayName("user not found when trying to delete")
    void shouldThrowErrorWhenTryingToDeleteUser() {

        // given
        UserRepository userRepository = Mockito.mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        UserService userService = new UserService(userRepository, passwordEncoder);

        when(userRepository.findByUsername("Santa")).thenReturn(Optional.empty());

        // then
        Exception exception = assertThrows(NoSuchUserException.class, () ->
                userService.deleteUser("Santa"));
        assertEquals("Server is unable to find this username.",
                exception.getMessage());
    }
}
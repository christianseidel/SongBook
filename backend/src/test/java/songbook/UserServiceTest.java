package songbook;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.springframework.security.crypto.password.PasswordEncoder;
import songbook.collections.ReferencesRepository;
import songbook.exceptions.NoSuchUserException;
import songbook.exceptions.PasswordsDoNotMatchException;
import songbook.exceptions.UserAlreadyExistsException;
import songbook.models.Song;
import songbook.users.*;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final SongRepository songRepository = mock(SongRepository.class);
    private final ReferencesRepository referencesRepository = mock(ReferencesRepository.class);
    private final SongSheetsRepository songSheetsRepository = mock(SongSheetsRepository.class);
    private final UserService userService = new UserService(userRepository, passwordEncoder, referencesRepository, songRepository, songSheetsRepository);

    @Test
    @DisplayName("user created")
    void shouldCreateUser() {

        // given
        UserCreationData newUserCreationData = new UserCreationData(null, "Cynthia", "cyn2cyn", "cyn2cyn");
        User user = new User("Cynthia", "SomePerfectlySecureHash");
        User savedUser = new User("Cynthia", "SomePerfectlySecureHash");
        when(userRepository.save(user)).thenReturn(savedUser);
        when(passwordEncoder.encode("cyn2cyn")).thenReturn("SomePerfectlySecureHash");

        // when

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
        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode("123456789")).thenReturn("BestSecuredPassword");

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
        when(passwordEncoder.encode("555666777")).thenReturn("PrimeSecuredPassword");
        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(user));

        // when
        UserInfoDTO actual = userService.getUserInfo("Alice");

        // then
        Assertions.assertEquals("2022-12-11", actual.getDateCreated());
    }

    @Test
    @DisplayName("user not found when trying to retrieve creation date")
    void shouldThrowErrorWhenTryingToFetchCreationDateOfNonExistingUser() {

        // given
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        when(userRepository.findByUsername("Santa")).thenReturn(Optional.empty());

        // then
        Exception exception = assertThrows(NoSuchUserException.class, () ->
                userService.getUserInfo("Santa"));
        assertEquals("Server is unable to find this username.",
                exception.getMessage());
    }

    @Test
    @DisplayName("user deleted")
    void shouldDeleteUser() {

        // given
        User existingUser = new User("Alice", "RabbitHole03");
        existingUser.setId("123456789");
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(existingUser));

        // when
        userService.deleteUser("Alice");

        // then
        Mockito.verify(userRepository).deleteById("123456789");
    }

    @Test
    @DisplayName("user and all user's items deleted")
    void shouldDeleteUserAndUsersItems() {

        // given
        User existingUser = new User("Alice", "RabbitHole03");
        existingUser.setId("123456789");
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        when(userRepository.findByUsername("Alice")).thenReturn(Optional.of(existingUser));

        // when
        userService.deleteUser("Alice");

        // then
        Mockito.verify(userRepository).deleteById("123456789");

        Mockito.verify(referencesRepository).deleteAllByUser("Alice");
    }


    @Test
    @DisplayName("user not found when trying to delete")
    void shouldThrowErrorWhenTryingToDeleteUser() {

        // given
        when(passwordEncoder.encode("123456789")).thenReturn("PrimeSecuredPassword");
        when(userRepository.findByUsername("Santa")).thenReturn(Optional.empty());

        // then
        Exception exception = assertThrows(NoSuchUserException.class, () ->
                userService.deleteUser("Santa"));
        assertEquals("Server is unable to find this username.",
                exception.getMessage());
    }
}
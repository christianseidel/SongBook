package songbook.users;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import songbook.SongRepository;
import songbook.SongSheetsRepository;
import songbook.collections.ReferencesRepository;
import songbook.exceptions.NoSuchUserException;
import songbook.exceptions.PasswordsDoNotMatchException;
import songbook.exceptions.UserAlreadyExistsException;
import songbook.models.Song;
import songbook.songsheets.models.SongSheet;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferencesRepository referencesRepository;
    private final SongRepository songRepository;
    private final SongSheetsRepository songSheetsRepository;

    public User createUser(UserCreationData userCreationData) {
        if (userCreationDataIsValid(userCreationData)) {
            User user = new User(userCreationData.getUsername(), passwordEncoder.encode(userCreationData.getPassword()));
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

    public UserInfoDTO getUserInfo(String username) {
        UserInfoDTO userInfo = new UserInfoDTO(username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(NoSuchUserException::new);
        userInfo.setDateCreated(user.getDateCreated().toString());
        userInfo.setNumberOfReferences(referencesRepository.findAllByUser(username).size());
        Optional<Song[]> songsOptional = songRepository.findAllByUser(username);
        if (songsOptional.isPresent()) {
            // set number of songs
            Song[] songs = songsOptional.get();
            int numberOfSongs = songs.length;
            userInfo.setNumberOfSongs(numberOfSongs);
            // set number of song sheet files
            int numberOfSongSheetFiles = 0;
            for (Song song : songs) {
                numberOfSongSheetFiles += song.getSongSheets().size();
            }
            userInfo.setNumberOfSongSheetFiles(numberOfSongSheetFiles);
        }
        return userInfo;
    }

    public void deleteUser(String username) throws NoSuchUserException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(NoSuchUserException::new);
        referencesRepository.deleteAllByUser(username);
        // delete all song sheet files which belong to user
        Optional<Song[]> songs = songRepository.findAllByUser(username);
        songs.ifPresent(song -> {
            for (Song value : song) {
                int numberOfSongSheetFiles = value.getSongSheets().size();
                if (numberOfSongSheetFiles > 0) {
                    List<SongSheet> songSheetList = value.getSongSheets();
                    for (int k = 0; k < numberOfSongSheetFiles; k++) {
                        songSheetsRepository.deleteById(songSheetList.get(k).getFileId());
                    }
                }
                // delete this song sheet
                songRepository.deleteById(value.getId());
            }
        });
        userRepository.deleteById(user.getId());
    }
}

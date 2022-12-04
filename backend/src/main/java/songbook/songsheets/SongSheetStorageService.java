package songbook.songsheets;


import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import songbook.songsheets.models.SongSheetFile;

import java.io.IOException;
import java.util.Objects;

@Service
public class SongSheetStorageService {

    private final SongSheetRepository songSheetRepository;

    public SongSheetStorageService(SongSheetRepository songSheetRepository) {
        this.songSheetRepository = songSheetRepository;
    }

    public SongSheetFile saveSongSheetFile(MultipartFile file) throws IOException {
        if (file.getSize() > 8_000_000) {
            System.out.println(file.getSize());
            throw new RuntimeException("The size of your file exceeds 8 MB!");
        }
        String name = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        SongSheetFile songSheetFile = new SongSheetFile();
        songSheetFile.setFileName(name);
        songSheetFile.setFile(file.getBytes());
        return songSheetRepository.save(songSheetFile);
    }

    public SongSheetFile retrieveSongSheetFile(String fileName) throws RuntimeException {
        SongSheetFile file = songSheetRepository
                .findByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("Server is unable to find your song sheet."));
        return file;
    }

    public void deleteSongSheetFile(String id) {
        if (songSheetRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Song sheet file with Id No. \"" + id + "\" could not be found.");
        };
        songSheetRepository.deleteById(id);
    }
}

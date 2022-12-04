package songbook.songsheets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class SheetStorageService {

    private Path fileStoragePath;
    private String fileStorageLocation;

    public SheetStorageService(@Value("${file.storage.location:tmp}") String fileStorageLocation) {

        this.fileStorageLocation = fileStorageLocation;
        fileStoragePath = Path.of(fileStorageLocation).toAbsolutePath().normalize();

        try {
            Files.createDirectories(fileStoragePath);
            System.out.println("File Storage Path:   " + fileStoragePath);
            System.out.println("fileStorageLocation: " + fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("File directory could not be created.");
        }
    }

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        Path filePath = Path.of(fileStoragePath + "\\" + fileName);

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Unable to store the song sheet file.", e);
        }

        return fileName;
    }

    public Resource downloadSongSheet(String fileName) {

        Path path = Path.of(fileStorageLocation).toAbsolutePath().resolve(fileName);

        Resource resource;
        try {
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Server is unable to retrieve the song sheet file.", e);
        }

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("The file either does not exist or is not readable.");
        }
    }
}

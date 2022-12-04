package songbook.songsheets.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "SongSheetFilesGreen")
public class SongSheetFileGreenVersion {

    @Id
    private String id;
    private String fileName;
    private byte[] file;

    public SongSheetFileGreenVersion() {
        // this.fileName = file.getOriginalFilename();
        // this.file = file;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

}

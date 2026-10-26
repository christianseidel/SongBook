package songbook.songsheets;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import songbook.songsheets.models.SongSheetFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Objects;

@Service
public class SongSheetStorageService {

    private final SongSheetRepository songSheetRepository;

    public SongSheetStorageService(SongSheetRepository songSheetRepository) {
        this.songSheetRepository = songSheetRepository;
    }

    public SongSheetFile saveSongSheetFile(MultipartFile file) throws RuntimeException, IOException {
        // check maximum maximum file size isn't exceeded
        if (file.getSize() > 8_000_000) {
            throw new RuntimeException("The size of your file exceeds 8 MB.");
        }
        String name = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // check file name doesn't exist // if so, add counter to name
        boolean checkedThatFilenameIsUnique = false;
        int counter = 0;
        while (!checkedThatFilenameIsUnique) {
            counter++;
            if (songSheetRepository.findByFilename(name).isPresent()) {
                int startFileExtension = name.lastIndexOf(".");
                String fileExtension = name.substring(startFileExtension);
                name = name.substring(0, startFileExtension);
                if (name.contains("_")) {
                    int lastUnderscore = name.lastIndexOf("_");
                    name = name.substring(0, lastUnderscore);
                }
                name += "_" + counter + fileExtension;
            } else {
                checkedThatFilenameIsUnique = true;
            }
        }
        SongSheetFile songSheetFile = new SongSheetFile();
        String contentType = file.getContentType();

        byte[] fileBytes = file.getBytes();

        if ("application/pdf".equals(contentType)) {
            fileBytes = configurePDF(file);
        }

        songSheetFile.setFile(fileBytes);

        songSheetFile.setContentType(contentType);
        songSheetFile.setFilename(name);
        return songSheetRepository.save(songSheetFile);
    }

    public byte[] configurePDF(MultipartFile file) throws IOException {

        PDDocument document = PDDocument.load(file.getBytes());

        try {

            // get document information
            PDDocumentInformation info = document.getDocumentInformation();

            // set title of the PDF document
            String title = "lala";
            info.setTitle(title);


            // save the modified PDF into memory
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);

            return outputStream.toByteArray();

        } finally {
            document.close();
        }
    }

    public SongSheetFile retrieveSongSheetFile(String id) throws RuntimeException {
        return songSheetRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Server is unable to find your song sheet."));
    }

    public void deleteSongSheetFile(String id) throws RuntimeException {
        if (songSheetRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Song sheet file with Id No. \"" + id + "\" could not be found.");
        };
        songSheetRepository.deleteById(id);
    }
}

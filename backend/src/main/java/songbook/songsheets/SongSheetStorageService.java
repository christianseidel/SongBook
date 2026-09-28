package songbook.songsheets;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItem;
import org.apache.pdfbox.io.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import songbook.songsheets.models.SongSheetFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

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
        if (contentType != null && contentType.equals("application/pdf")) {
            file = configurePDF(file);
        }
        songSheetFile.setFile(file.getBytes());
        songSheetFile.setContentType(contentType);
        songSheetFile.setFilename(name);
        return songSheetRepository.save(songSheetFile);
    }

    public MultipartFile configurePDF(MultipartFile file) throws IOException {
        CommonsMultipartFile multipartFile = null;
        // load existing PDF document
        Path targetFile = Files.createTempFile("pdfFile", ".pdf");
        // TODO: elaborate on this
        file.transferTo(targetFile);
        System.out.println("1) " + file.getSize());
        PDDocument document = PDDocument.load(targetFile.toFile());

        // get document information
        PDDocumentInformation info = document.getDocumentInformation();

        // set title of the PDF document
        String title = "lala";
        info.setTitle(title);

        // save the file
        document.save(targetFile.toFile());

        // reconstruct MultipartFile
        File targetFileReloaded = new File("D:\\Musik\\Ukulele\\SongBook\\backend\\src\\main\\resources\\tmp\\pdfFile.pdf");
        System.out.println("2_a) " + targetFileReloaded.getName());
        System.out.println("2_a) " + targetFileReloaded.length());
        System.out.println("2_a) " + targetFileReloaded.getParent());
        System.out.println("2_a) " + targetFileReloaded.getClass());
        FileItem fileItem = new DiskFileItem("file", "application/pdf", false, targetFileReloaded.getName(), (int) targetFileReloaded.length(), targetFileReloaded.getParentFile());
        InputStream inputStream = new FileInputStream(targetFileReloaded);
        OutputStream outputStream = fileItem.getOutputStream();
        IOUtils.copy(inputStream, outputStream);

        fileItem.getOutputStream();
        System.out.println("2) " + fileItem.getSize());
        System.out.println("2b) " + fileItem.getHeaders());
        multipartFile = new CommonsMultipartFile(fileItem);
        System.out.println("3) " + multipartFile.getSize());
        return multipartFile;
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

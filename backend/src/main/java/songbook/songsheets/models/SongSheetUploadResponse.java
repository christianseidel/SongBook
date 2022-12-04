package songbook.songsheets.models;

public class SongSheetUploadResponse {

    private String id;
    private String fileName;
    private String contentType;
    private String url;

    public SongSheetUploadResponse(String fileName, String contentType, String id, String url) {
        this.id = id;
        this.fileName = fileName;
        this.contentType = contentType;
        this.url = url;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}

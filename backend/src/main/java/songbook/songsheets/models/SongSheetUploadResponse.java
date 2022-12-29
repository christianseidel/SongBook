package songbook.songsheets.models;

public class SongSheetUploadResponse {

    private String id;
    private String filename;
    private String contentType;
    private String url;

    public SongSheetUploadResponse(String id, String filename, String contentType) {
        this.id = id;
        this.filename = filename;
        this.contentType = contentType;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
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
}

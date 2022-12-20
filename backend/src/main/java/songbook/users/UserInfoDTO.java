package songbook.users;

import lombok.Data;

public class UserInfoDTO {

    private String userName;
    private String dateCreated;
    private int numberOfReferences;
    private int numberOfSongs;
    private int numberOfSongSheetFiles;

    public UserInfoDTO(String userName) {
        this.userName = userName;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getDateCreated() {
        return this.dateCreated;
    }

    public void setNumberOfReferences(int numberOfReferences) {
        this.numberOfReferences = numberOfReferences;
    }

    public int getNumberOfReferences() {
        return this.numberOfReferences;
    }

    public void setNumberOfSongs(int numberOfSongs) {
        this.numberOfSongs = numberOfSongs;
    }

    public int getNumberOfSongs() {
        return this.numberOfSongs;
    }

    public void setNumberOfSongSheetFiles(int numberOfSongSheetFiles) {
        this.numberOfSongSheetFiles = numberOfSongSheetFiles;
    }

    public int getNumberOfSongSheetFiles() {
        return this.numberOfSongSheetFiles;
    }

}

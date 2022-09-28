package songbook.models;

import lombok.Data;

import java.util.List;

@Data
public class SongsDTO {

    private List<Song> songList;

    public SongsDTO(List<Song> songList) {
        this.songList = songList;
    }
}

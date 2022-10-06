package songbook.models;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class SongsDTO {

    private List<Song> songList;

    public SongsDTO(List<Song> songList) {
        this.songList = songList;
    }
}

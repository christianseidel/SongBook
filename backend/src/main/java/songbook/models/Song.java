package songbook.models;

import java.util.ArrayList;
import java.util.List;

public class Song {
    public String title;
    public String author;
    public List<ReferenceRetained> references = new ArrayList<>();
}

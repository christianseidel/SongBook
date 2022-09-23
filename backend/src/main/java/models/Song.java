package models;

import collections.models.Reference;
import collections.models.ReferenceVolume;

import java.util.ArrayList;
import java.util.List;

public class Song {
    public String title;
    public String author;
    public List<ReferenceRetained> references = new ArrayList<>();
}

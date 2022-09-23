package collections.models;

public class Reference {

    public String title;
    public ReferenceVolume volume;
    public short page;
    public String author;

    public Reference(String title) {
        this.title = title;
    }

    public Reference(String title, ReferenceVolume volume) {
        this.title = title;
        this.volume = volume;
    }

    public Reference(String title, short page) {
        this.title = title;
        this.page = page;
    }

    public Reference(String title, ReferenceVolume volume, short page) {
        this.title = title;
        this.volume = volume;
        this.page = page;
    }

}

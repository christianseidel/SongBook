package songbook.models;

import lombok.Data;

@Data
public class Link {
    private String linkText;
    private String linkTarget;

    public Link (String linkText, String linkTarget) {
        this.linkText = linkText;
        this.linkTarget = linkTarget;
    }
}

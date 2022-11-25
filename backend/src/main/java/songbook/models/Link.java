package songbook.models;

import lombok.Data;

@Data
public class Link {
    private String linkText;
    private String linkTarget;
    private String linkKey;
    private String linkAuthor;
    private String linkStrumming;

    public Link (String linkText, String linkTarget, String linkKey, String linkAuthor, String linkStrumming) {
        this.linkText = linkText;
        this.linkTarget = linkTarget;
        this.linkKey = linkKey;
        this.linkAuthor = linkAuthor;
        this.linkStrumming = linkStrumming;
    }
}

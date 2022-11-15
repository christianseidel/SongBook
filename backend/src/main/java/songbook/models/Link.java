package songbook.models;

import lombok.Data;

@Data
public class Link {
    private String linkText;
    private String linkTarget;
    private String linkKey;
    private String linkDescription;

    public Link (String linkText, String linkTarget, String linkKey) {
        this.linkText = linkText;
        this.linkTarget = linkTarget;
        this.linkKey = linkKey;

    }
}

package songbook.collections.models;

import lombok.Data;
import java.util.List;

@Data
public class ReferencesDTO {

    private List<Reference> referenceList;

    public ReferencesDTO(List<Reference> referenceList) {
        this.referenceList = referenceList;
    }
}

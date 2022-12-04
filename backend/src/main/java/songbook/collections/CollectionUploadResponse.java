package songbook.collections;

import lombok.Data;
import java.util.ArrayList;

@Data
public class CollectionUploadResponse {
    private int numberOfReferencesAccepted;
    private int numberOfExistingReferences;
    private int numberOfReferencesRejected;
    private int totalNumberOfReferences; // serves as check sum
    private ArrayList<String> listOfLinesWithInvalidCollectionName;
    private ArrayList<String> listOfLinesWithInvalidPageData;

    public CollectionUploadResponse() {
        this.numberOfReferencesAccepted = 0;
        this.numberOfExistingReferences = 0;
        this.numberOfReferencesRejected = 0;
        this.totalNumberOfReferences = 0;
        this.listOfLinesWithInvalidCollectionName = new ArrayList<>();
        this.listOfLinesWithInvalidPageData = new ArrayList<>();
    }

    public void addLineWithInvalidCollectionName(String illegalCollectionName) {
        listOfLinesWithInvalidCollectionName.add(illegalCollectionName);
    }

    public void addLineWithInvalidPageDatum(String illegalPage) {
        listOfLinesWithInvalidPageData.add(illegalPage);
    }
}

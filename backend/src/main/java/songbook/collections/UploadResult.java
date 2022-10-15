package songbook.collections;

import lombok.Data;
import java.util.ArrayList;

@Data
public class UploadResult {
    int numberOfReferencesAccepted;
    int numberOfExistingReferences;
    int numberOfReferencesRejected;
    int totalNumberOfReferences; // serves as check sum
    ArrayList<String> listOfLinesWithInvalidVolumeData;
    ArrayList<String> listOfLinesWithInvalidPageData;

    public UploadResult() {
        this.numberOfReferencesAccepted = 0;
        this.numberOfExistingReferences = 0;
        this.numberOfReferencesRejected = 0;
        this.totalNumberOfReferences = 0;
        this.listOfLinesWithInvalidVolumeData = new ArrayList<>();
        this.listOfLinesWithInvalidPageData = new ArrayList<>();
    }

    public void addLineWithInvalidVolumeDatum(String illegalVolume) {
        listOfLinesWithInvalidVolumeData.add(illegalVolume);
    }

    public void addLineWithInvalidPageDatum(String illegalPage) {
        listOfLinesWithInvalidPageData.add(illegalPage);
    }
}

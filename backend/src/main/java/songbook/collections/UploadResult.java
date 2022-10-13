package songbook.collections;

import lombok.Data;
import java.util.ArrayList;

@Data
public class UploadResult {
    short numberOfReferencesAccepted;
    short numberOfReferencesRejected;
    short totalNumberOfReferences; // serves as check sum
    ArrayList<String> listOfInvalidVolumes;
    short numberOfInvalidVolumeData;
    ArrayList<String> listOfInvalidPageData;
    short numberOfInvalidPageData;

    public UploadResult() {
        this.numberOfReferencesAccepted = 0;
        this.numberOfReferencesRejected = 0;
        this.totalNumberOfReferences = 0;
        this.listOfInvalidVolumes = new ArrayList<>();
        this.numberOfInvalidVolumeData = 0;
        this.listOfInvalidPageData = new ArrayList<>();
        this.numberOfInvalidPageData = 0;
    }

    public void addIllegalVolumeToList(String illegalVolume) {
        for (int i = 0; i < listOfInvalidVolumes.size(); i++) {
            if (listOfInvalidVolumes.get(i).equals(illegalVolume)) {
                i++;
            } else {
                listOfInvalidVolumes.add(illegalVolume);
            }
        }
        numberOfInvalidVolumeData++;
    }

    public void addIllegalPageToList(String illegalPage) {
        for (int i = 0; i < listOfInvalidVolumes.size(); i++) {
            if (listOfInvalidVolumes.get(i).equals(illegalPage)) {
                i++;
            } else {
                listOfInvalidVolumes.add(illegalPage);
            }
        }
        numberOfInvalidPageData++;
    }
}

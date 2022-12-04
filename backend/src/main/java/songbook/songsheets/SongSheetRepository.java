package songbook.songsheets;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import songbook.songsheets.models.SongSheetFileGreenVersion;

@Repository
public interface SheetRepository extends MongoRepository<SongSheetFileGreenVersion, String> {

    SongSheetFileGreenVersion findByFileName(String fileName);
}

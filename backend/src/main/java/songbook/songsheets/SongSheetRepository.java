package songbook.songsheets;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import songbook.songsheets.models.SongSheetFile;

import java.util.Optional;

@Repository
public interface SongSheetRepository extends MongoRepository<SongSheetFile, String> {

    Optional<SongSheetFile> findByFilename(String filename);
}

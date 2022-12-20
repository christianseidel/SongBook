package songbook;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import songbook.songsheets.models.SongSheetFile;


@Repository
public interface SongSheetsRepository extends MongoRepository<SongSheetFile, String> {

    @Override
    <S extends SongSheetFile> S save(S entity);
}

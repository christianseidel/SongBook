package songbook;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import songbook.models.SongSheetFileMyVersion;


@Repository
public interface SongSheetsRepository extends MongoRepository<SongSheetFileMyVersion, String> {

    @Override
    <S extends SongSheetFileMyVersion> S save(S entity);
}

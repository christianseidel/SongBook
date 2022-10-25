package songbook.collections;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;

import songbook.collections.models.Reference;
import songbook.collections.models.SongCollection;


@Repository
public interface ReferencesRepository extends MongoRepository<Reference, String> {

    @Override
    List<Reference> findAll();

    Collection<Reference> findAllByTitleAndSongCollection(String title, SongCollection songCollection);

    @Override
    <S extends Reference> S save(S entity);

}

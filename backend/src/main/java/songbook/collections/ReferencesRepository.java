package songbook.collections;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import songbook.collections.models.Reference;
import songbook.collections.models.ReferenceVolume;


@Repository
public interface ReferencesRepository extends MongoRepository<Reference, String> {

    Collection<Reference> findAllByTitle(String title);

    Collection<Reference> findAllByTitleAndVolume(String title, ReferenceVolume volume);

    @Override
    <S extends Reference> S save(S entity);

}

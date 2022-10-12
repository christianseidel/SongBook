package songbook.collections;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;

import songbook.collections.models.Reference;
import songbook.collections.models.ReferenceVolume;


@Repository
public interface ReferencesRepository extends MongoRepository<Reference, String> {

    @Override
    List<Reference> findAll();

    Collection<Reference> findAllByTitleAndVolume(String title, ReferenceVolume volume);

    @Override
    <S extends Reference> S save(S entity);

}

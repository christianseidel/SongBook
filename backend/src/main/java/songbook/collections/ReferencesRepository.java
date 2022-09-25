package songbook.collections;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import songbook.collections.models.Reference;

import java.util.Collection;

@Repository
public interface ReferencesRepository extends MongoRepository<Reference, String> {

    Collection<Reference> findAllByTitle(String title);

}

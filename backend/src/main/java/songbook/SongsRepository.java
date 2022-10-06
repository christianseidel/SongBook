package songbook;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;

import songbook.models.Song;


@Repository
public interface SongsRepository extends MongoRepository<Song, String> {

    Collection<Song> findAllByTitle(String title);

    @Override
    <S extends Song> S save(S entity);
}

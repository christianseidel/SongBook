package songbook;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import songbook.models.Song;

import java.util.Collection;

@Repository
public interface SongsRepository extends MongoRepository<Song, String> {

    Collection<Song> findAllByTitle(String title);

    @Override
    <S extends Song> S save(S entity);
}

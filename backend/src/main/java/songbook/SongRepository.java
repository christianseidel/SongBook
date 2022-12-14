package songbook;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.Optional;

import songbook.models.Song;


@Repository
public interface SongRepository extends MongoRepository<Song, String> {

    Collection<Song> findAllByTitle(String title);

    @Override
    <S extends Song> S save(S entity);

    Optional<Song> findByIdAndUser(String id, String user);

    Optional<Song> findByTitleAndUser(String id, String user);

    Optional<Song[]> findAllByUser(String user);

}

package songbook;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.FluentQuery;
import songbook.collections.ReferencesRepository;
import songbook.collections.ReferencesService;
import songbook.collections.models.Reference;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public class SongBookNewMain {

    public static void main(String[] args) {

//        ReferencesService service = new ReferencesService();
//        service.importSongCollection("serviceTest_twoPerfectLines");
    }
}

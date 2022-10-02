package songbook.collections;

import javax.annotation.Resource;
import java.io.File;
import java.nio.file.Path;

public interface StorageService {

    void init();

    void store(File fil);

    Path load(String filename);

    Resource loadsAsResource(String filename);

    void delete();
}

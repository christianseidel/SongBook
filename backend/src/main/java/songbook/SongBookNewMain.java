package songbook;

import songbook.models.Song;

public class SongBookNewMain {

    public static void main(String[] args) {

        String title = "My Way";
        String author = "Almighty";
        Song mySong = new Song(title, author);

        System.out.println(mySong);

        System.out.println(mySong.getDateCreated());


//        ReferencesService service = new ReferencesService();
//        service.importSongCollection("serviceTest_twoPerfectLines");
    }
}

export interface Song {
    id: string;
    title: string;
    author: string;
}

export interface SongsDTO {
    songList: Array<Song>;
}
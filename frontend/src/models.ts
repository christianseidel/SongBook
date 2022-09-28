export interface Song {
    id: string;
    title: string;
    author: string;
    status?: Status;
}

export enum Status {
    write = "WRITE",
}

export interface SongsDTO {
    songList: Array<Song>;
}

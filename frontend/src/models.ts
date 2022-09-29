export interface Song {
    id: string;
    title: string;
    author: string;
    status?: Status;
    dateCreated?: string;
    dayOfCreation: DayOfCreation;
}

export class DayOfCreation {
    day: string;
    month: string;
    year: string;

    constructor(dateCreated: string) {
        this.day = dateCreated.slice(8)
        this.month = dateCreated.slice(5, 7)
        this.year = dateCreated.slice(2, 4)
    }
}

export enum Status {
    write = "WRITE",
}

export interface SongsDTO {
    songList: Array<Song>;
}

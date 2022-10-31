export interface Song {
    id: string;
    title: string;
    author: string;
    year?: string;
    dateCreated?: string;
    dayOfCreation: DayOfCreation;
    description?: string;
    resources?: {};
    status: string;
}

export interface Link {
    linkText: string;
    linkTarget: string;
}

export class DayOfCreation {
    day: string;
    month: string;
    year: string;

    constructor(dateCreated: string) {
        this.day = dateCreated.slice(8)
        this.month = dateCreated.slice(5, 7)
        this.year = dateCreated.slice(0, 4)
    }
}

export enum Status {
    write = "WRITE",
}

export interface SongsDTO {
    songList: Array<Song>;
}

import {Reference} from "../References/referenceModels";
import {keys} from "../literals/keys";

export interface Song {
    id: string;
    title: string;
    author?: string;
    year?: number;
    dateCreated?: string;
    dayOfCreation: DayOfCreation;
    description?: string;
    references?: Array<Reference>;
    status: string;
    links?: Array<Link>;
}

export class Link {
    linkText: string;
    linkTarget: string;
    linkKey: string;
    linkAuthor: string;
    linkStrumming: string;

    constructor(linkText: string, linkTarget: string, linkKey: string, linkAuthor: string, linkStrumming: string) {
        this.linkText = linkText;
        this.linkTarget = linkTarget;
        this.linkKey = linkKey;
        this.linkAuthor = linkAuthor;
        this.linkStrumming = linkStrumming;
    }
}

export class Mood {
    static checkIfMajorOrEmpty(key: string | undefined) {
        if (key === undefined) {
            return true;
        } else if (key === '') {
            return true;
        } else {
            return keys.every(k => {
                return k.mood[1].value !== key;
            })
        }
    }
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

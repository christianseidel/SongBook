export class Reference {
    id?: string;
    title: string;
    songCollection: string;
    page: number;
    author?: string;
    year?: number;
    key?: string;
    hidden?: boolean;
    addedCollection: string;
    user?: string;

    constructor(title: string, collection: string,
                page: number, author?: string, year?: number, key?: string) {
        this.title = title;
        this.songCollection = 'MANUALLY_ADDED_COLLECTION';
        this.addedCollection = collection;
        this.page = page;
        this.author = author;
        this.year = year;
        this.key = key;
    }
}

export interface ReferencesDTO {
    referenceList: Array<Reference>;
}

export interface UploadResult {
    numberOfReferencesAccepted: number;
    numberOfExistingReferences: number;
    numberOfReferencesRejected: number;
    totalNumberOfReferences: number;
    listOfLinesWithInvalidCollectionName: [string];
    listOfLinesWithInvalidPageData: [string];
}

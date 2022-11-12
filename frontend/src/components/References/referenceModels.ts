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

export function songCollectionToRealName (volume: string) {
    switch (volume) {
        case 'THE_DAILY_UKULELE_YELLOW':
            return 'The Daily Ukulele Yellow';
        case 'THE_DAILY_UKULELE_BLUE':
            return 'The Daily Ukulele Blue';
        case 'LIEDERBUCH_1':
            return 'Liederbuch (1)';
        case 'LIEDERKISTE_2':
            return 'Liederkiste (2)';
        case 'LIEDERKARREN_3':
            return 'Liederkarren (3)';
        case 'LIEDERCIRCUS_4':
            return 'Liedercircus (4)';
        case 'LIEDERKORB_5':
            return 'Liederkorb (5)';
        case 'LIEDERBAUM_6':
            return 'Liederbaum (6)';
        case 'LIEDERWOLKE_7':
            return 'Liederwolke (7)';
        case 'LIEDERSONNE_8':
            return 'Liedersonne (8)';
        case 'LIEDERSTERN_9':
            return 'Liederstern (9)';
        case 'LIEDERSTRAUSS_10':
            return 'Liederstrauß (10)';
        case 'LIEDERBALLON_11':
            return 'Liederballon (11)';
        case 'LIEDERGARTEN_12':
            return 'Liedergarten (12)';
        case 'LIEDERZUG_13':
            return 'Liederzug (13)';
        case 'LIEDERWELT_14':
            return 'Liederwelt (14)';
        case 'LIEDERFEST_15':
            return 'Liederfest (15)';
        case 'MANUALLY_ADDED_COLLECTION':
            return 'manually added';
    }
}
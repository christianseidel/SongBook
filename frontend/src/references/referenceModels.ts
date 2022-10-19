export interface Reference {
    id: string;
    title: string;
    volume: string;
    page: number;
    author?: string;
    year: number;
}

export interface ReferencesDTO {
    referenceList: Array<Reference>;
}

export interface UploadResult {
    numberOfReferencesAccepted: number;
    numberOfExistingReferences: number;
    numberOfReferencesRejected: number;
    totalNumberOfReferences: number;
    listOfLinesWithInvalidVolumeData: [string];
    listOfLinesWithInvalidPageData: [string];
}

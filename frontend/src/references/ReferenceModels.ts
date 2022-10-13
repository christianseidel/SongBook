export interface Reference {
    id: string;
    title: string;
    volume: string;
    page: string;
    author?: string;
    year: string;
}

export interface ReferencesDTO {
    referenceList: Array<Reference>;
}

export interface UploadResult {
    numberOfReferencesAccepted?: number;
    numberOfReferencesRejected?: number;
    totalNumberOfReferences?: number;
    listOfInvalidVolumes: [string];
    numberOfInvalidVolumeData?: number;
    listOfInvalidPageData?: [string];
    numberOfInvalidPageData?: number;
}

/*
setUploadResult('Backend received your file "' + files[0].name + '". ' +
    'Out of a total of ' + responseBody.totalNumberOfReferences + ' references, ' +
    responseBody.numberOfReferencesAccepted + ' references where added.');
*/

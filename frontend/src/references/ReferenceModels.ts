import {Song} from "../models";

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
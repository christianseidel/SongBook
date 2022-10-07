import {Song} from "../models";

export interface Reference {
    id: string;
    title: string;
    volume: string;
    page: number;
    author: string;
    year: number;
}

export interface ReferencesDTO {
    referenceList: Array<Reference>;
}
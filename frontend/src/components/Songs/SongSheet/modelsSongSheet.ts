
export class SongSheet {
    name: string;
    source?: string;
    description?: string;
    key?: string;
    fileId?: string;
    filename?: string;
    dateUploaded: string;

    constructor(name: string, source: string, description: string, key: string, fileId: string, filename: string) {
        this.name = name;
        this.source = source;
        this.description = description;
        this.key = key;
        this.fileId = fileId;
        this.filename = filename;
        this.dateUploaded = getCurrentDate();
    }
}

const getCurrentDate = () => {
    let date = new Date();
    return String(date.getDate()).padStart(2, '0') + '.'
        + String(date.getMonth() + 1).padStart(2, '0') +'.'
        + date.getFullYear();
}

export interface SongSheetUploadResponse {
    id: string;
    filename: string;
    contentType: string;
}

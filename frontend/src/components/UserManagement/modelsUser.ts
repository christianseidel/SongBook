export interface UserDTO {
    username: string
    dateCreated: string;
    numberOfReferences?: number;
    numberOfSongs?: number;
    numberOfSongSheetFiles?: number;
}

export const checkLogin = (status: number) => {
    if((status === 401)||(status === 403)) {
        throw new Error("forbidden")}
}
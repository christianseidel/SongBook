import {createContext} from "react";
import {Song} from "./songModels";

export interface Context {
    createSongFromReference: (id: string) => Promise<Song>;
}

export default createContext({} as Context)
import {createContext} from "react";
import {message} from "../messageModel";

export interface Context {
    createSongFromReference: (id: string) => Promise<message>;
}

export default createContext({} as Context)
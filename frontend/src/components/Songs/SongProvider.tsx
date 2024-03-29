import {useContext} from "react";
import {useAuth} from "../UserManagement/AuthProvider";
import SongContext from "./SongContext";
import {Song} from "./songModels";

interface Param {
    children?: any;
}

export default function SongProvider({children}: Param) {

    const {token} = useAuth();

    const createSongFromReference = (id: string) => {
        return fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/add/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    throw Error('Something unexpected happened! '
                        + 'Error type: "' + response.statusText
                        + '". Error code: ' + response.status + '.')
                }
                return response.json();
            })
            .then((responseBody: Song) => {return responseBody})
    }

    return (
        <SongContext.Provider
            value={{
                createSongFromReference,
            }}>
            {children}
        </SongContext.Provider>
    )

}

export const useSong = () => useContext(SongContext)
import React, { useState, useEffect } from 'react';
import './styles/landingPage.css'
import {Song, SongsDTO} from "./models";
import SongItem from "./SongItem";
import SongDetails from "./SongDetails";

function App() {

    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    const [songChosen, setSongChosen] = useState({} as Song)
    const [error, setError] = useState('')


    useEffect(() => {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => {return response.json()})
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
    }, []);

    function displayItemChosen(id: string) {
        fetch('/api/songbook/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw Error("Ein Eintrag mit der ID " + id + " wurde nicht gefunden.")
                }
            })
            .then((responseBody: Song) => setSongChosen(responseBody))
            .catch(e => setError(e.message));
    }


    return (
        <div className={"songWrapper"}>
            <div className={"songName"}>
                {songsDTO.songList
                    ? songsDTO.songList.map(item => <SongItem key={item.id}
                                            song={item} onItemMarked={displayItemChosen}/>)
                    : <span>... loading</span>
                }
            </div>
            <div className={"songDetails"}>
                {songChosen.title
                    ? <SongDetails song={songChosen}/>
                    : <span>... loading</span>
                }
            </div>
        </div>
    );
}

export default App;

import React, {useState, useEffect, FormEvent} from 'react';
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
                    throw Error("An Item with Id no. " + id + " could not be found.")
                }
            })
            .then((responseBody: Song) => setSongChosen(responseBody))
            .catch(e => setError(e.message));
    }

    function fetchAllItems() {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => {return response.json()})
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
            .then(() => setSongChosen({} as Song));
    }

    function createItem() {
        alert('ok, ok')
    }

    function cancelCreate() {
        alert('mal gucken')
    }

    const createSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert ('kpommt')
    }

    return (
        <div>
        <h1>My Song Book</h1>
        <div className={"songWrapper"}>
            <div className={"songName"}>
                {songsDTO.songList
                    ? songsDTO.songList.map(item => <SongItem key={item.id} song={item}
                                         onItemMarked={displayItemChosen}
                    />)
                    : <span>... loading</span>
                }

                <div onClick={createItem}> - + - </div>
            </div>
            <div className={"songDetails"}>
                {songChosen.title
                    ? <SongDetails song={songChosen} onItemDeletion={fetchAllItems}/>
                    : <span>&#129172; &nbsp; please choose a song</span>
                }
            </div>
            <div className={"songDetails"}>
                <form onSubmit={ev => createSong(ev)}>
                    <input type="text" placeholder={'title'} required />
                    <input type="text" placeholder={'author'} />
                    <button id={"button-create-do"} type="submit"> &#10004; create </button>
                    <div>
                        <button id={"button-create-cancel"} type="submit" onClick={cancelCreate}> &#10008; cancel </button>
                    </div>
                </form>

            </div>

        </div>
        </div>
    );
}

export default App;

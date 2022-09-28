import React, {useEffect, useState} from 'react';
import './styles/landingPage.css'
import {Song, SongsDTO, Status} from "./models";
import SongItem from "./SongItem";
import SongItemDetails from "./SongItemDetails";

function App() {

    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    let [songChosen, setSongChosen] = useState({} as Song)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => {
                return response.json()
            })
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
            .then(response => {
                return response.json()
            })
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
            .then(() => setSongChosen({} as Song));
    }

    let newSong: Song = {title: "no title yet", author: "no author yet", id: "", status: Status.write};

    function createItem() {
        setSongChosen(newSong);
    }


    function setMessage(message: string) {

            const displayMessage = document.getElementById('displayMessage');
            const p = document.createElement("p");
            p.textContent = message;
            p.style.marginTop = "3px";
            p.style.marginBottom = "3px";
            displayMessage?.appendChild(p);
        setTimeout(function () {
            displayMessage?.removeChild(p);
        }, 2000);
    }


    return (
        <div>
            <h1>My Song Book</h1>
            <div className={"flex-parent"}>

                <div className={"flex-child"}>
                    {songsDTO.songList
                        ? songsDTO.songList.map(item =>
                            <SongItem key={item.id} song={item}
                                      onItemMarked={displayItemChosen}
                            />)
                        : <span>... loading</span>
                    }

                    <div onClick={createItem}>
                        <span id={"addNewSong"}>+ add new song</span>
                    </div>
                </div>

                <div className={"flex-child"}>
                    {
                        songChosen.title
                            ? <SongItemDetails song={songChosen}
                                               onItemDeletion={(message: string) => {
                                                   setMessage(message);
                                                   fetchAllItems();
                                               }}
                                               onItemCreation={(message: string) => {
                                                   setMessage(message);
                                                   fetchAllItems();
                                               }}
                            onCancel={fetchAllItems}/>
                            : <span>&#129172; &nbsp; please choose a song</span>
                    }
                </div>

            </div>
            <div id={"displayMessage"}></div>
        </div>
    );
}

export default App;

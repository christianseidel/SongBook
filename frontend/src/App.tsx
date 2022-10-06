import React, {useEffect, useState} from 'react';
import './styles/landingPage.css';
import './styles/commons.css';
import {Song, SongsDTO, Status, DayOfCreation} from "./models";
import SongItem from "./SongItem";
import SongItemDetails from "./SongItemDetails";
import ukulele from "./images/ukulele.png";
import References from "./references/References";

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
            .then((responseBody: Song) => {
                responseBody.dayOfCreation = new DayOfCreation(responseBody.dateCreated as string);
                setSongChosen(responseBody);
            })
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


    let newSong: Song = {title: "no title", author: "", id: "", dateCreated: "22-09-29",
        dayOfCreation: new DayOfCreation("22-09-29"), status: Status.write};

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

    const hintToList = document.getElementById('chooseASong') as HTMLSpanElement | null;
        // ToDo: Reactivate This After Item Deletion or New Creation
    if (hintToList != null ) {
        hintToList.addEventListener('mouseover', showSongsToChooseFrom)
    }

    function showSongsToChooseFrom() {
        //  ToDo: Shorten This Function
        let i: number = -1;
        let top: number = Math.min(songsDTO.songList.length, 6) - 1;

        let rotationInterval = setInterval(function () {
            i++;
            const singleSongToHighlight = document.getElementById(songsDTO.songList[i].id) as HTMLDivElement | null;
            if (singleSongToHighlight != null) {
                singleSongToHighlight.style.color = "yellow";
                singleSongToHighlight.style.position = "relative";
                singleSongToHighlight.style.left = "7px";
            }
            const singleSongNotToHighlight = document.getElementById(songsDTO.songList[i - 1].id) as HTMLDivElement | null;
            if (singleSongNotToHighlight != null) {
                singleSongNotToHighlight.style.color = "unset";
                singleSongNotToHighlight.style.left = "0";
            }

            if (i === top) {
                clearInterval(rotationInterval);
                setTimeout(function () {
                    const LastSingleSongNotToHighlight = document.getElementById(songsDTO.songList[i].id) as HTMLDivElement | null;
                    if (LastSingleSongNotToHighlight != null) {
                        LastSingleSongNotToHighlight.style.color = "unset";
                        LastSingleSongNotToHighlight.style.left = "0";
                    }
                }, 110);
            }
        }, 100);
    }


    return (
        <div>
            <h1><img src={ukulele} alt="Ukulele" id={'ukulele'} /> My Song Book</h1>
            <div className={"flex-parent"}>

                <div className={"flex-child"}>
                    <div onClick={createItem}>
                        <span id={"addNewSong"} className={"doSomething"} >+ add new song</span>
                    </div>

                    {songsDTO.songList
                        ? songsDTO.songList.map(item =>
                            <SongItem key={item.id} song={item}
                                      onItemMarked={displayItemChosen}
                            />)
                        : <span>... loading</span>
                    }
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
                                               onCancel={fetchAllItems}
                                               />
                            : <span id={"chooseASong"}>&#129172; &nbsp; please choose a song</span>
                    }
                </div>

            </div>
            <div id={"displayMessage"}></div>

            <div>
                <References />
            </div>

        </div>
    );
}

export default App;

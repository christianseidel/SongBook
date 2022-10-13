import React, {useEffect, useState} from 'react';
import './styles/landingPage.css';
import './styles/common.css';
import {Song, SongsDTO, Status, DayOfCreation} from "./models";
import SongItem from "./SongItem";
import SongItemDetails from "./SongItemDetails";
import ukulele from "./images/ukulele.png";
import References from "./references/References";

function App() {

    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    let [songChosen, setSongChosen] = useState({} as Song)

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
            .catch(e => setMessage(e.message));
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

    const highlightSongList = document.getElementById('chooseASong') as HTMLSpanElement | null;
    if (highlightSongList != null ) {
        highlightSongList.addEventListener('mouseover', highlightSongsToChooseFrom)
    }

    function highlightSongsToChooseFrom() {
        let i: number = 0;
        let top: number = Math.min(songsDTO.songList.length, 5);
        // initial glow
        glowItem(document.getElementById(songsDTO.songList[0].id));
        // glow rush
        let shimmerInterval = setInterval(function () {
            i++;
            glowItem(document.getElementById(songsDTO.songList[i].id));
            unglowItem(document.getElementById(songsDTO.songList[i - 1].id));
            if (i === top) {
                clearInterval(shimmerInterval);
                // final glow
                setTimeout(function () {
                    unglowItem(document.getElementById(songsDTO.songList[i].id));
                }, 110);
            }
        }, 100);
    }

    const glowItem = (item: HTMLElement | null) => {
        if (item != null) {
            item.style.color = 'yellow';
            item.style.transform = 'translate(7px)';
        }
    }

    const unglowItem = (item: HTMLElement | null) => {
        if (item != null) {
            item.style.color = 'unset';
            item.style.transform = 'translate(0)';
        }
    }

    return (
        <div id={'container'}>
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
                                               onItemRevision={(message: string) => {
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

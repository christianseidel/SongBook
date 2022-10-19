import React, {useEffect, useState} from 'react';
import './styles/landingPage.css';
import './styles/common.css';
import {Song, SongsDTO, Status, DayOfCreation} from "./songs/songModels";
import SongItemWithinList from "./songs/SongItemWithinList";
import SongItemDetails from "./songs/SongItemDetails";
import ukulele from "./images/ukulele.png";
import References from "./references/References";
import DisplayMessageSongs from "./songs/DisplayMessageSongs";

function App() {

    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    let [songChosen, setSongChosen] = useState({} as Song)
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => {
                return response.json()
            })
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
    }, []);

    function displaySongChosen(id: string) {
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
            .catch((e) => {
                setMessage(e.message);
                sessionStorage.setItem('messageType', 'red');
            });
    }

    function getAllSongs() {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
            .then(() => setSongChosen({} as Song));
        setMessage(sessionStorage.getItem('message') ?? '');
    }


    let newSong: Song = {title: "no title", author: "", id: "", dateCreated: "22-09-29",
        dayOfCreation: new DayOfCreation("22-09-29"), status: Status.write};

    function createItem() {
        setSongChosen(newSong);
    }

    const highlightSongList = document.getElementById('chooseASong') as HTMLSpanElement | null;
    if (highlightSongList != null ) {
        highlightSongList.addEventListener('mouseover', highlightSongsToChooseFrom)
    }

    function highlightSongsToChooseFrom() {
        if (songsDTO.songList.length > 1) {
            let i: number = 0;
            let lastI: number = Math.min(songsDTO.songList.length, 6) - 1;
            // initial glow
            glowItem(document.getElementById(songsDTO.songList[0].id));
            // glow rush
            const shimmerInterval = setInterval(function () {
                i++;
                glowItem(document.getElementById(songsDTO.songList[i].id));
                unglowItem(document.getElementById(songsDTO.songList[i - 1].id));
                if (i === lastI) {
                    clearInterval(shimmerInterval);
                    // final glow
                    if (i < songsDTO.songList.length) {
                        setTimeout(function () {
                            unglowItem(document.getElementById(songsDTO.songList[i].id));
                        }, 110);
                    }
                }
            }, 100);
        }
    }

    const glowItem = (item: HTMLElement | null) => {
        if (item != null) {
            item.style.color = 'yellow';
            item.style.left = '7px';
        }
    }

    const unglowItem = (item: HTMLElement | null) => {
        if (item != null) {
            item.style.color = 'darkgreen';
            item.style.left = '0';
        }
    }

    return (
        <div id={'container'}>
            <h1><img src={ukulele} alt="Ukulele" id={'ukulele'} /> My Song Book</h1>
            <div className={"flex-parent"}>

                <div className={"flex-child"}>
                    <div onClick={createItem}>
                        <span className={"doSomething"} id={"addNewSong"}>+ add new song</span>
                    </div>

                    {songsDTO.songList
                        ? songsDTO.songList.map(item =>
                            <SongItemWithinList key={item.id} song={item}
                                                onItemMarked={displaySongChosen}
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
                                                   getAllSongs();
                                               }}
                                               onItemCreation={(message: string) => {
                                                   setMessage(message);
                                                   getAllSongs();
                                               }}
                                               onItemRevision={(message: string) => {
                                                   setMessage(message);
                                                   getAllSongs();
                                               }}
                                               doReturn={getAllSongs}
                                               />
                            : <span className={"doSomething"} id={"chooseASong"}>&#129172; &nbsp; please choose a song</span>
                    }
                </div>


            </div>

            <div>
                <References />
            </div>

            <div>
                {message && <DisplayMessageSongs
                    message={message}
                    onClose={() => {
                        setMessage('');
                        sessionStorage.setItem('message', '');
                        sessionStorage.removeItem('messageType')
                    }}
                />}
            </div>

        </div>
    );
}

export default App;

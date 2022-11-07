import React, {useEffect, useState} from 'react';
import './styles/landingPage.css';
import './styles/common.css';
import {Song, SongsDTO, DayOfCreation} from "./Songs/songModels";
import SongItemWithinList from "./Songs/SongItemWithinList";
import SongItemDetailsView from "./Songs/SongItemDetailsView";
import ukulele from "./media/images/ukulele.png";
import References from "./References/References";
import DisplayMessageSongs from "./Songs/DisplayMessageSongs";
import {Reference, ReferencesDTO} from "./References/referenceModels";

function SongBook() {

    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    const [songChosen, setSongChosen] = useState({} as Song);
    const [message, setMessage] = useState('');

    const [dragOverLeft, setDragOverLeft] = useState(false)
    const handleDragOverStartLeft = () => setDragOverLeft(true);
    const handleDragOverEndLeft = () => setDragOverLeft(false);
    const [dragOverRight, setDragOverRight] = useState(false)
    const handleDragOverStartRight = () => setDragOverRight(true);
    const handleDragOverEndRight = () => setDragOverRight(false);


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
                responseBody.dayOfCreation = new DayOfCreation( // = displayable format of "dateCreated"
                    responseBody.dateCreated as string
                );
                responseBody.status = 'display';
                setSongChosen(responseBody);
            })
            .catch((e) => {
                setMessage(e.message);
                sessionStorage.setItem('messageType', 'red');
            });
    }

    function getAllSongs(clearSong: boolean) {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
            .then(() => { if (clearSong) {setSongChosen({} as Song)}});
        setMessage(sessionStorage.getItem('message') ?? '');
    }

    let newSong: Song = {title: "no title", author: "", id: "", status: "create",
        dayOfCreation: new DayOfCreation(new Date().toISOString().slice(0, 10))};

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

    const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    // HAVE NEW SONG ITEMS CREATED BY DRAGGING & DROPPING A REFERENCE
    const handleDropAndCreateSongFromReference = (event: React.DragEvent<HTMLDivElement>) => {
        const id = event.dataTransfer.getData('text');
        let songCreatedFromReference: Song;

        // get reference
        let referenceRetrieved: Reference;
        fetch('api/collections/edit/' + id, {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) =>
                referenceRetrieved = responseBody.referenceList[0])
            .then(() => {

                // create new Song from Reference Retrieved
                let responseStatus: number;
                fetch(`api/songbook/add/${id}`, {
                    method: 'POST'
              })
                    .then(response => {
                        responseStatus = response.status;
                        return response.json();
                    })
                    .then((responseBody) => {
                        if (responseStatus === 200) {
                            songCreatedFromReference = responseBody;
                            sessionStorage.setItem('messageType', 'green');
                            sessionStorage.setItem('message', 'Your song "' + responseBody.title
                                + '" was successfully created!');
                        } else {
                            sessionStorage.setItem('message', 'Your reference could not be retrieved ' +
                                'form the server (error code: ' + responseStatus + ')');
                            sessionStorage.setItem('messageType', 'red');
                        }
                    })
            .then(() => {

                // hide Reference Retrieved
                fetch('api/collections/edit/hide/' + referenceRetrieved.id, {
                    method: 'PUT',
                    })
                    .then(response => {
                        if (response.status !== 200) {
                            sessionStorage.setItem('message', 'Your source reference could not be hidden!');
                            sessionStorage.setItem('messageType', 'red');
                        }}
                    )

                })
            .then(() => {
                // display freshly created Song
                songCreatedFromReference.status = 'display';
                songCreatedFromReference.dayOfCreation = new DayOfCreation( // = displayable format of "dateCreated"
                    songCreatedFromReference.dateCreated as string
                );
                setSongChosen(songCreatedFromReference);
                getAllSongs(false);
                // rerenders Reference List:
                trigger();
                // Todo: message gets called twice -- once by setSongChosen, once by trigger
                //  -- need to fix this....
            });
        })
        setDragOverLeft(false);
        setDragOverRight(false);
    }

    let receiver = () => {}

    const trigger = () => {receiver && receiver();}

    const receiverRerenderSignal = (handler: () => void) => {
        receiver = handler;
    }

    return (
        <div id={'container'}>
            <h1><img src={ukulele} alt="Ukulele" id={'ukulele'} /> My Song Book</h1>
            <div className={"flex-parent"}>

                <div className={"flex-child"}
                     onDragOver={enableDropping}
                     onDrop={handleDropAndCreateSongFromReference}
                     onDragEnter={handleDragOverStartLeft}
                     onDragLeave={handleDragOverEndLeft}
                     style={dragOverLeft ? {backgroundColor: 'rgb(243, 217, 167)'} : {}}
                >
                    <div onClick={createItem}>
                        <span className={"doSomething"} id={"addNewSong"}>+ add new song</span>
                    </div>
                    <div id={'displaySongList'}>
                        {songsDTO.songList
                            ? songsDTO.songList.map(item =>
                                <SongItemWithinList key={item.id} song={item}
                                                    openItemClicked={displaySongChosen}
                                />)
                            : <span>... loading</span>
                        }
                    </div>
                </div>

                <div className={'flex-child'}
                     onDragOver={enableDropping}
                     onDrop={handleDropAndCreateSongFromReference}
                     onDragEnter={handleDragOverStartRight}
                     onDragLeave={handleDragOverEndRight}
                     style={dragOverRight ? {backgroundColor: 'rgb(243, 217, 167)'} : {}}
                >
                    {
                        songChosen.title
                            ? <SongItemDetailsView song={songChosen}
                                                   onItemDeletion={(message: string) => {
                                                        setMessage(message);
                                                        getAllSongs(true);
                                                        trigger();
                                                        alert("bin hier")
                                               }}
                                                   onItemCreation={(message: string) => {
                                                        setMessage(message);
                                                        getAllSongs(true);
                                               }}
                                                   onItemRevision={(song) => {
                                                        song.dayOfCreation = new DayOfCreation( // = displayable format of "dateCreated"
                                                            song.dateCreated as string
                                                        );
                                                        getAllSongs(false);
                                                        setSongChosen(song);
                                               }}
                                                   doReturn={() => {getAllSongs(true); trigger()}}
                                                   clear={() => setSongChosen({} as Song)}
                                               />
                            : <span className={"doSomething"} id={"chooseASong"}>&#129172; &nbsp; please, choose a song</span>
                    }
                </div>
            </div>

            <div>
                <References
                    receiverRerenderSignal={receiverRerenderSignal}/>
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

export default SongBook;

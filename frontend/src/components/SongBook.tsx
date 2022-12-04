import React, {useEffect, useState} from 'react';
import './styles/landingPage.css';
import './styles/common.css';
import SongItemWithinList from "./Songs/SongItemWithinList";
import SongItemDetails from "./Songs/SongItemDetails";
import ukulele from "./media/images/ukulele.png";
import References from "./References/References";
import {message, MessageType, NewMessage} from "./messageModel";
import DisplayMessage from "./DisplayMessage";
import {DayOfCreation, Song, SongsDTO} from "./Songs/modelsSong";
import {Reference, ReferencesDTO} from "./References/modelsReference";

function SongBook() {

    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    const [songChosen, setSongChosen] = useState({} as Song);
    const [myFeedback, setMyFeedback] = useState<message | undefined>(undefined);

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
                    setMyFeedback(NewMessage.create(
                        "An Item with Id no. " + id + " could not be found.",
                        MessageType.RED));
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
                setMyFeedback(NewMessage.create(e.message, MessageType.RED));
            });
    }

    function getAllSongs(clearSong: boolean) {
        fetch('/api/songbook', {
            method: 'GET',
        })
            .then(response => response.json())
            .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
            .then(() => {
                if (clearSong) {
                    setSongChosen({} as Song)
                }
            });
    }

    let newSong: Song = {
        title: "no title", author: "", id: "", status: "create",
        dayOfCreation: new DayOfCreation(new Date().toISOString().slice(0, 10))
    };

    function createItem() {
        setSongChosen(newSong);
    }

    const highlightSongList = document.getElementById('chooseASong') as HTMLSpanElement | null;
    if (highlightSongList != null) {
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
                            setMyFeedback(NewMessage.create('Your song "' + responseBody.title
                            + '" was successfully created!', MessageType.GREEN));
                        } else {
                            setMyFeedback(NewMessage.create('Your reference could not be retrieved ' +
                                'form the server (error code: ' + responseStatus + ')', MessageType.RED));
                        }
                    })
                    .then(() => {

                        // hide Reference Retrieved
                        fetch('api/collections/edit/hide/' + referenceRetrieved.id, {
                            method: 'PUT',
                        })
                            .then(response => {
                                    if (response.status !== 200) {
                                        setMyFeedback(NewMessage.create('Your source reference could not be hidden!', MessageType.RED));
                                    }
                                }
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
                    });
            })
        setDragOverLeft(false);
        setDragOverRight(false);
    }

    let receiver = () => {
    }

    const trigger = () => {
        receiver && receiver();
    }

    const receiverRerenderSignal = (handler: () => void) => {
        receiver = handler;
    }

    return (
        <div>
            <h1>
                <img src={ukulele} alt="Ukulele" id={'ukulele'}/>
                My Song Book
            </h1>
            <div className={"flex-parent"}>
                <div className={"flex-container-left"}>
                    <div className={"flex-child"}
                         onDragOver={enableDropping}
                         onDrop={handleDropAndCreateSongFromReference}
                         onDragEnter={handleDragOverStartLeft}
                         onDragLeave={handleDragOverEndLeft}
                         style={dragOverLeft ? {backgroundColor: 'rgb(243, 217, 167)'} : {}}
                    >
                        <h2 className={"inline"}>List of Songs</h2>
                        <span onClick={createItem} className={"doSomething"} id={"addANewSong"}>
                        + add new song
                    </span>

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

                    <div className={"flex-child"}>
                        <References
                            receiverRerenderSignal={receiverRerenderSignal}/>
                    </div>
                </div>

               <div className={'flex-container-right'}
                     onDragOver={enableDropping}
                     onDrop={handleDropAndCreateSongFromReference}
                     onDragEnter={handleDragOverStartRight}
                     onDragLeave={handleDragOverEndRight}
                     style={dragOverRight ? {backgroundColor: 'rgb(243, 217, 167)'} : {}}
                >
                    {
                        songChosen.title
                            ? <SongItemDetails song={songChosen}
                                               onItemRevision={(song: Song) => {
                                                       song.dayOfCreation = new DayOfCreation( // = displayable format of "dateCreated"
                                                           song.dateCreated as string
                                                       );
                                                       getAllSongs(false);
                                                       setSongChosen(song);
                                                   }}
                                               doReturn={() => {
                                                       getAllSongs(true);
                                                       trigger()
                                                   }}
                                               clear={() => setSongChosen({} as Song)}
                                               displayMsg={(msg) => setMyFeedback(msg)}
                            />
                            : <span className={"doSomething"}
                                    id={"chooseASong"}>&#129172; &nbsp; please, choose a song</span>
                    }
                </div>
            </div>

            <DisplayMessage message={myFeedback}/>
        </div>
    );
}

export default SongBook;

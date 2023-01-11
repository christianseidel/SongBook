import React, {useEffect, useState} from 'react';
import './styles/landingPage.css';
import './styles/common.css';
import SongItemWithinList from './Songs/SongItemWithinList';
import SongItemDetails from './Songs/SongItemDetails';
import ukulele from './media/images/ukulele.png';
import References from './References/References';
import {message, MessageType, NewMessage} from './messageModel';
import MessageBox from './MessageBox';
import {DayOfCreation, Song, SongsDTO} from './Songs/modelsSong';
import {Reference, ReferencesDTO} from './References/modelsReference';
import {useAuth} from './UserManagement/AuthProvider';
import {useNavigate} from 'react-router-dom';
import {checkLogin} from "./UserManagement/modelsUser";

function SongBook() {

    const {token, logout} = useAuth();
    const nav = useNavigate();
    const [songsDTO, setSongsDTO] = useState({} as SongsDTO);
    const [songChosen, setSongChosen] = useState({} as Song);
    const [message, setMessage] = useState<message | undefined>(undefined);

    const [dragOverLeft, setDragOverLeft] = useState(false)
    const handleDragOverStartLeft = () => setDragOverLeft(true);
    const handleDragOverEndLeft = () => setDragOverLeft(false);
    const [dragOverRight, setDragOverRight] = useState(false)
    const handleDragOverStartRight = () => setDragOverRight(true);
    const handleDragOverEndRight = () => setDragOverRight(false);

    useEffect(() => {
        if (!localStorage.getItem('jwt')) {
            nav('/users/login')
        } else {
            fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    checkLogin(response.status);
                    return response.json();
                })
                .then((responseBody: SongsDTO) => setSongsDTO(responseBody))
                .catch(() => nav('/users/login'))
        }
    }, [nav, token])

    function displaySongChosen(id: string) {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/` + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    setMessage(NewMessage.create(
                        'An Item with Id no. ' + id + ' could not be found.',
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
                setMessage(NewMessage.create(e.message, MessageType.RED));
            });
    }

    function getAllSongs(clearSong: boolean) {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
        title: 'no title', author: '', id: '', status: 'create', description: '',
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
            let lastI: number = Math.min(songsDTO.songList.length, 8) - 1;
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
                        const timeoutId = setTimeout(function () {
                            unglowItem(document.getElementById(songsDTO.songList[i].id));
                        }, 110);
                        return () => clearTimeout(timeoutId);
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
        fetch(`${process.env.REACT_APP_BASE_URL}/api/collections/edit/` + id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then((responseBody: ReferencesDTO) =>
                referenceRetrieved = responseBody.referenceList[0])
            .then(() => {
                // create new Song from Reference Retrieved
                let responseStatus: number;
                fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/add/${id}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        responseStatus = response.status;
                        return response.json();
                    })
                    .then((responseBody) => {
                        if (responseStatus === 200) {
                            songCreatedFromReference = responseBody;
                            setMessage(NewMessage.create('Your song "' + responseBody.title
                                + '" was successfully created!', MessageType.GREEN));
                        } else {
                            setMessage(NewMessage.create('Your reference could not be retrieved ' +
                                'form the server (error code: ' + responseStatus + ')', MessageType.RED));
                        }
                    })
                    .then(() => {

                        // hide Reference Retrieved
                        fetch(`${process.env.REACT_APP_BASE_URL}/api/collections/edit/hide/` + referenceRetrieved.id, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                            .then(response => {
                                    if (response.status !== 200) {
                                        setMessage(NewMessage.create('Your source reference could not be hidden!', MessageType.RED));
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
                <img src={ukulele} alt='Ukulele' id={'ukuleleMainPage'}/>
                My Song Book

                <div id='dropdownUser'>
                    <button id='buttonDropdownUser' type={'button'}>user</button>
                    <div className='contentDropdownUser'>
                        <span className={'menuItem'} onClick={logout}>&#10140; logout </span>
                        <span className={'menuItem'} onClick={() => nav('/users/info')}>Info</span>
                    </div>
                </div>
            </h1>

            <div className={'flex-parent'}>
                <div className={'flex-container-left'}>
                    <div className={'flex-child'}
                         onDragOver={enableDropping}
                         onDrop={handleDropAndCreateSongFromReference}
                         onDragEnter={handleDragOverStartLeft}
                         onDragLeave={handleDragOverEndLeft}
                         style={dragOverLeft ? {backgroundColor: 'rgb(243, 217, 167)'} : {}}
                    >
                        <h2 className={'inline'}>Songs</h2>
                        <span onClick={createItem} className={'doSomething'} id={'addANewSong'}>
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

                    <div className={'flex-child'}>
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
                                                   song.dayOfCreation = new DayOfCreation( // = displayable format of 'dateCreated'
                                                       song.dateCreated as string
                                                   );
                                                   getAllSongs(false);
                                                   setSongChosen(song);
                                               }}
                                               doReturn={() => {
                                                   getAllSongs(true);
                                                   trigger()
                                               }}
                                               onClear={() => setSongChosen({} as Song)}
                                               displayMsg={(msg) => setMessage(msg)}
                            />
                            : <span className={'doSomething'}
                                    id={'chooseASong'}>&#129172; &nbsp; please, choose a song</span>
                    }
                </div>
            </div>

            <MessageBox message={message}/>
        </div>
    );
}

export default SongBook;

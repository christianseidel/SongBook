import {Song} from './songModels'
import '../styles/common.css'
import '../styles/songDetails.css'
import React, {useEffect, useState} from "react";
import DisplayMessageSongs from "./DisplayMessageSongs";
import EditSongTitle from "./EditSongTitle";
import CreateSongTitle from "./CreateSongTitle";
import DisplaySongTitle from "./DisplaySongTitle";

interface SongItemProps {
    song: Song;
    handOverSongState: string;
    onItemDeletion: (message: string) => void;
    onItemCreation: (message: string) => void;
    onItemRevision: (song: Song) => void;
    doReturn: () => void;
    clear: () => void;
}

function SongDetailsView(props: SongItemProps) {

    const [songState, setSongState] = useState(props.song.status);
    const [message, setMessage] = useState('');

    useEffect(() => setSongState(props.song.status))

    let handleSongState;  // controls the first two lines of the Song Details View
    if (songState === 'display') {
        handleSongState = <DisplaySongTitle
            song={props.song}
            updateDetailsView={() => setSongState(props.song.status)}
            clear={props.clear}
        />;
    } else if (songState === 'edit') {
        handleSongState = <EditSongTitle
            song={props.song}
            updateDetailsView={() => setSongState(props.song.status)}
            onItemRevision={(song) => props.onItemRevision(song)}
        />;
    } else if (songState === 'create') {
        handleSongState = <CreateSongTitle
            song={props.song}
            onItemCreation={(song) => props.onItemRevision(song)}
            clear={props.clear}
        />;
    }

    function deleteSong(id: string) {
        fetch('/api/songbook/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    sessionStorage.setItem('messageType', 'green');
                    sessionStorage.setItem('message', 'Your song "' + props.song.title + '" was deleted!');
                } else {
                    sessionStorage.setItem('messageType', 'red');
                    sessionStorage.setItem('message', 'Your song could not be deleted!');
                }
            })
            .then(props.doReturn);
    }


    return (
        <div>
            <div>{handleSongState}</div>

            <div id={'songContainer'}>
                <div id={'displayDateCreated'}>
                    created: {props.song.dayOfCreation.day}.{props.song.dayOfCreation.month}.{props.song.dayOfCreation.year}
                </div>
                <span id={'buttonDeleteSong'}>
                    <button onClick={() => deleteSong(props.song.id)}>
                        &#10008; delete
                    </button>
                </span>
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
    )
}

export default SongDetailsView


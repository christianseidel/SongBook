import {Song} from './songModels'
import '../styles/common.css'
import '../styles/songDetails.css'
import React, {FormEvent, useEffect, useState} from "react";
import DisplayMessageSongs from "./DisplayMessageSongs";
import EditSongTitle from "./EditSongTitle";
import CreateSongTitle from "./CreateSongTitle";
import DisplaySongTitle from "./DisplaySongTitle";

interface SongItemProps {
    song: Song;
    onItemDeletion: (message: string) => void;
    onItemCreation: (message: string) => void;
    onItemRevision: (song: Song) => void;
    doReturn: () => void;
    clear: () => void;
}

function SongItemDetailsView(props: SongItemProps) {

    const [songState, setSongState] = useState(props.song.status);
    const [message, setMessage] = useState('');

    useEffect(() => setSongState(props.song.status), [props.song.status]);

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

    const toggleOpenDescription = (description: string) => {

    }

    const [description, setDescription] = useState(sessionStorage.getItem('description') ?? '');
    useEffect(() => {
        sessionStorage.setItem('description', description)}, [description]);

    const doAddDescription = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        props.song.description = description;
        alert(description + " !!!")
        setDescription('');
        sessionStorage.removeItem('description');
    }

    let link;
    return (
        <div>
            <div id={'songHead'}>
            <div>{handleSongState}</div>
            </div>

            <div id={'songBody'}>
                <div id={'iconContainer'}>
                        <span className={'circle iconInfo tooltip'} onClick={() => alert("youhou!!")}>
                            i
                            <span className="tooltipText">add a description</span>
                        </span>
                        <span className={'circle iconReference tooltip'} onClick={() => alert("adding references yet to implement")}>
                            Rf
                            <span className="tooltipText">add a song sheet reference</span>
                        </span>
                        <span className={'circle iconLink tooltip'} onClick={() => alert("adding links yet to implement")}>
                            &#8734;
                            <span className="tooltipText">add a link</span>
                        </span>
                        <span className={'circle iconFile tooltip'} onClick={() => alert("adding song sheets as a file yet to implement")}>
                            &#128195;
                            <span className="tooltipText">add a file</span>
                        </span>
                </div>

                <div>
                    <form onSubmit={ev => doAddDescription(ev)}>
                        <label>Add a Description:</label><br/>
                        <textarea id={'inputDescription'} value={description}
                                rows={3}
                                  cols={60}
                                placeholder={'your description here...'}
                                onChange={ev => setDescription(ev.target.value)} autoFocus required/>
                        <button id={'buttonAddDescription'} type='submit'> &#10004; add</button>
                        <br/>

                    </form>
                </div>



                <div id={'displayDateCreated'}>
                    created: {props.song.dayOfCreation.day}.
                    {props.song.dayOfCreation.month}.
                    {props.song.dayOfCreation.year}

                    <span id={'buttonDeleteSong'}>
                        <button onClick={() => deleteSong(props.song.id)}>
                            &#10008; delete
                        </button>
                    </span>
                </div>
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

export default SongItemDetailsView


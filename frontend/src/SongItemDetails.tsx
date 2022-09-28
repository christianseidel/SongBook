import {Song, Status} from './models'
import './styles/songs.css'
import React, {FormEvent, useState} from "react";

interface SongItemProps {
    song: Song
    onItemDeletion: () => void;
    onItemCreation: (message: string) => void;
}

function SongItemDetails(props: SongItemProps) {

    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');

    function deleteItem(id: string) {
        fetch('/api/songbook/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {

                } else {
                    throw Error("An item with Id no. " + id + " could not be found.")
                }
            })
            .then(() => props.onItemDeletion())
            .catch(e => setError(e.message));
    }

    const doCreateSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('api/songbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    title: title,
                    author: author,
                })

        })
            .then(response => {
                if (response.ok) {
                    props.onItemCreation("Your song was successfully created!")
                } else {
                    throw Error("nicht angelegt");
                }
            })
            .catch(e => setError(e.message));
    }

    function cancelCreateSong() {
        alert('gecancelt')

    }


    return (
        <div>
            {(props.song.status != Status.write)
                ?
                <div>
                    <div>
                        {props.song.title}
                        <span onClick={() => deleteItem(props.song.id)}>- X -</span>
                    </div>
                    by: {props.song.author} <br/>
                </div>
                :
                <div>
                    <form onSubmit={ev => doCreateSong(ev)}>
                        <label>Title:</label>
                            <input id={"inputTitle"} type="text" value={title} placeholder={'Title'}
                                   onChange={ev => setTitle(ev.target.value)} autoFocus required/><br/>
                        <label>By:</label>
                            <input id={"inputAuthor"} type="text" placeholder={'Author'}
                                    onChange={ev => setAuthor(ev.target.value)}/><br/>
                        <button id={"buttonCancel"} type="submit" onClick={cancelCreateSong}> &#10008; cancel</button>
                        <button id={"buttonCreate"} type="submit"> &#10004; create</button>
                    </form>
                </div>
            }
        </div>
    )
}

export default SongItemDetails
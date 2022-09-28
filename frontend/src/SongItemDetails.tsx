import {Song, Status} from './models'
import './styles/songs.css'
import React, {FormEvent, useState} from "react";

interface SongItemProps {
    song: Song
    onItemDeletion: (message: string) => void;
    onItemCreation: (message: string) => void;
    onCancel: () => void;
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
                    props.onItemDeletion("Your song was deleted!")
                } else {
                    throw Error("An item with Id no. " + id + " could not be found.")
                }
            })
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


    return (
        <div>
            {(props.song.status != Status.write)
                ?
                <div>
                    <div className={'header'}>
                        <label>Title:</label> <span className={'title'}> {props.song.title}</span>
                        <span onClick={() => deleteItem(props.song.id)}>[ X ]</span>
                    </div>
                    {props.song.author && <label>By:</label>} {props.song.author && <span className={'author'}> {props.song.author}</span>}<br/>
                </div>
                :
                <div>
                    <form onSubmit={ev => doCreateSong(ev)}>
                        <div className={'header'}>
                            <label>Title:</label>
                            <input className={"title"} id={'inputTitle'} type="text" value={title} placeholder={'Title'}
                                   onChange={ev => setTitle(ev.target.value)} autoFocus required/><br/>
                        <label>By:</label>
                            <input className={"author"} type="text" placeholder={'Author'}
                                    onChange={ev => setAuthor(ev.target.value)}/><br/>
                        </div>

                        <button id={"buttonCreate"} type="submit"> &#10004; create</button>
                    </form>
                    <button id={"buttonCancel"} type="submit" onClick={props.onCancel}> &#10008; cancel</button>
                </div>
            }
        </div>
    )
}

export default SongItemDetails
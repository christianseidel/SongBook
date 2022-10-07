import {Song, Status} from './models'
import './styles/commons.css'
import './styles/songs.css'
import React, {FormEvent, useState} from "react";

interface SongItemProps {
    song: Song
    onItemDeletion: (message: string) => void;
    onItemCreation: (message: string) => void;
    onItemRevision: (message: string) => void;
    onCancel: () => void;
}


function SongItemDetails(props: SongItemProps) {

    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');

    function deleteItem(id: string) {
        // ToDo: Install Confirm Box
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

    const editItem = (id: string) => {
        alert("Da muss ich noch ran! It n°: " + id)

    }

    const doEditItem = (event: FormEvent<HTMLFormElement>) => {
    /*    event.preventDefault();
        fetch('api/songbook/{id}' + eventxxx, {
            method: 'PUT',
            body: JSON.stringify({
                title: title,
                author: author,
                year: year,
            }),
            headers: {
                'ContentType': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    props.onItemRevision("Your song was updated!")
                } else {
                    throw Error("An item with Id no. " + id + "count not be found.")
                }
            })
            .catch(e => setError(e.message));
            */
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
                    year: year,
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
            {(props.song.status !== Status.write)
                ?
                <div>
                    <div className={'header'}>
                        <label>Title:</label> <span className={'title'}> {props.song.title}</span>
                        <span id={'buttonEditSong'}><button onClick={() => editItem(props.song.id)}>&#8734; edit &nbsp;</button></span>
                        <span id={'buttonDeleteSong'}><button onClick={() => deleteItem(props.song.id)}>&#10008; delete</button></span>
                    </div>
                    <div>{props.song.author && <label>By:</label>} {props.song.author && <span className={'author'}> {props.song.author} </span>}
                        {props.song.year && <span>(<label>Year:</label></span>} {props.song.year && <span className={'year'}> {props.song.year})</span>}</div>

                    <div className={'dateCreated'}>
                        <label id={"dateCreated"}>created:</label>
                        <span className={'dateCreated'}>{props.song.dayOfCreation.day}.{props.song.dayOfCreation.month}.{props.song.dayOfCreation.year}</span>

                    </div>

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
                                    onChange={ev => setAuthor(ev.target.value)}/>
                            <label id={'labelYear'}>Year:</label>
                            <input className={"year"} type="text" placeholder={'Year of Creation'}
                                   onChange={ev => setYear(ev.target.value)}/><br/>
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
import {Song, Status} from './songModels'
import '../styles/common.css'
import '../styles/songDetails.css'
import React, {FormEvent, useState} from "react";
import DisplayMessageSongs from "./DisplayMessageSongs";

interface SongItemProps {
    song: Song
    onItemDeletion: (message: string) => void;
    onItemCreation: (message: string) => void;
    onItemRevision: (message: string) => void;
    doReturn: () => void;
}


function SongItemDetails(props: SongItemProps) {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [message, setMessage] = useState('');

    function deleteSong(id: string) {
        fetch('/api/songbook/' + id, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    sessionStorage.setItem('messageType', 'green');
                    sessionStorage.setItem('message', 'Your song was deleted!');
                } else {
                    sessionStorage.setItem('messageType', 'red');
                    sessionStorage.setItem('message', 'Your song could not be deleted!');
                }
            })
            .then(props.doReturn);
    }

    const editSong = (id: string) => {
        setMessage("Sorry, this function has not yet been implemented! (Id n°: " + id + ").");
        sessionStorage.setItem('messageType', 'blue');
    }

    /*
    const doEditItem = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
    }
     */

    const doCreateSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let responseStatus: number;
        fetch('api/songbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                    title: title,
                    author: author,
                    year: year,
                })
        })
            .then(response => {
                responseStatus = response.status;
                return response.json();
            })
            .then((responseBody) => {
                if (responseStatus === 200) {
                    sessionStorage.setItem('messageType', 'green');
                    sessionStorage.setItem('message', 'Your song was successfully created!');
                } else {
                    sessionStorage.setItem('message', responseBody.message);
                    sessionStorage.setItem('messageType', 'red');
                }
            })
            .then((props.doReturn));
    }

return (
        <div>
            {(props.song.status !== Status.write)
                ?
                <div>
                    <div className={'header'}>
                        <label>Title:</label> <span className={'title'}> {props.song.title}</span>
                        <span id={'buttonEditSong'}><button onClick={() => editSong(props.song.id)}>&#8734; edit &nbsp;</button></span>
                    </div>
                    <div>{props.song.author && <label>By:</label>} {props.song.author && <span className={'author'}> {props.song.author} </span>}
                        {props.song.year && <span>(<label>Year:</label></span>} {props.song.year && <span className={'year'}> {props.song.year})</span>}
                        <span id={'buttonDeleteSong'}><button onClick={() => deleteSong(props.song.id)}>&#10008; delete</button></span>
                    </div>

                    <div className={'dateCreated'}>
                        <label id={"dateCreated"}>created: </label>
                        <span className={'dateCreated'}>{props.song.dayOfCreation.day}.{props.song.dayOfCreation.month}.{props.song.dayOfCreation.year}</span>
                    </div>


                </div>
                :
                <div>
                    <form onSubmit={ev => doCreateSong(ev)}>
                        <div className={'header'}>
                            <label>Title:</label>
                            <input className={'title'} id={'inputTitle'} type='text' value={title} placeholder={'Title'}
                                   onChange={ev => setTitle(ev.target.value)} autoFocus required/><br/>
                            <label>By:</label>
                            <input className={'author'} type="text" placeholder={'Author'}
                                    onChange={ev => setAuthor(ev.target.value)}/>
                            <label id={'labelYear'}>Year:</label>
                            <input className={'year'} type="text" placeholder={'Year of Creation'}
                                   onChange={ev => setYear(ev.target.value)}/><br/>
                        </div>

                        <button id={'buttonCreate'} type='submit'> &#10004; create</button>
                    </form>
                    <button id={'buttonCancel'} type='submit' onClick={props.doReturn}> &#10008; cancel</button>
                </div>
            }

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

export default SongItemDetails


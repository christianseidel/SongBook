import React, {FormEvent, useState} from "react";
import {Song} from "./songModels";

interface SongItemProps {
    song: Song;
    onItemCreation: (song: Song) => void;
    clear: () => void;
}

function CreateSongTitle(props: SongItemProps) {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(props.song.author);
    const [year, setYear] = useState(props.song.year);

    const doCreateSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let responseStatus: number;
        fetch('api/songbook', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
                    responseBody.status = 'display';
                    props.onItemCreation(responseBody);
                } else {
                    sessionStorage.setItem('message', responseBody.message);
                    sessionStorage.setItem('messageType', 'red');
                }
            })
    }

    return (
        <div>
            <form onSubmit={ev => doCreateSong(ev)}>
                <div className={'header'}>
                    <label>Title:</label>
                    <input id={'inputTitle'} type='text' value={title} placeholder={'Title'}
                           onChange={ev => setTitle(ev.target.value)} autoFocus required/>
                    <button id={'buttonCreate'} type='submit'> &#10004; create</button>
                    <br/>
                    <label>By:</label>
                    <input id={'inputAuthor'} type="text" value={author} placeholder={'Author'}
                           onChange={ev => setAuthor(ev.target.value)}/>
                    <label id={'labelYear'}>Year:</label>
                    <input className={'year'} type="number" value={(props.song.year !== '0') ? year : ''}
                           placeholder={'Year of Creation'}
                           onChange={ev => setYear(ev.target.value)}/>
                    <button id={'buttonCancel'}
                            onClick={() => {
                                props.clear()
                            }}> &#10008; cancel
                    </button>
                    <br/>
                </div>
            </form>
        </div>
    )
}

export default CreateSongTitle
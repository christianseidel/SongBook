import React, {FormEvent, useState} from "react";
import {Song} from "../songModels";

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
                <div>
                    <span id={'titleLine'}>
                        <label>Title:</label>
                        <input id={'inputTitle'} type='text' value={title} placeholder={'Title'}
                               onChange={ev => setTitle(ev.target.value)} autoFocus required/>
                        <button id={'buttonCreateSong'} type='submit'> &#10004; create</button>
                    </span>
                    <label>By:</label>
                    <input id={'inputAuthor'} type="text" value={author} placeholder={'Author'}
                           onChange={ev => setAuthor(ev.target.value)}/>
                    <label id={'labelInputYear'}>Year:</label>
                    <input id={'inputYear'} type="number" value={(props.song.year != '0') ? year : ''}
                           placeholder={'Year created'}
                           onChange={ev => setYear(ev.target.value)}/>
                    <button id={'buttonCancelCreateSong'}
                            onClick={() => {
                                props.clear()
                            }}> &#10008; cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateSongTitle
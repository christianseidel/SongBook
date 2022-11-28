import React, {FormEvent, useState} from "react";
import {Song} from "../songModels";
import '../../styles/songDetails.css'
import {message, MessageType, NewMessage} from "../../messageModel";

interface SongItemProps {
    song: Song;
    onItemCreation: (song: Song) => void;
    displayMsg: (msg: message) => void;
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
                    props.displayMsg(NewMessage.create('Your song "' + title + '" was successfully created.', MessageType.GREEN))
                } else {
                    props.displayMsg(NewMessage.create('Your song "' + title + '" could not be created. ' + responseBody.message, MessageType.RED))
                }
            })
    }

    return (
        <div>
            <form onSubmit={ev => doCreateSong(ev)}>
                <div>
                    <span id={'titleFirstLine'}>
                        <label>Title:</label>
                        <input id={'inputTitle'} type='text' value={title} placeholder={'Title'}
                               onChange={ev => setTitle(ev.target.value)} autoFocus required/>
                        <button id={'buttonCreateSong'} type='submit'> &#10004; create</button>
                    </span>
                    <label>By:</label>
                    <input id={'inputAuthor'} type="text" value={author} placeholder={'Author'}
                           onChange={ev => setAuthor(ev.target.value)}/>
                    <label className={'labelSecondInLine'}>Year:</label>
                    <input id={'inputYear'} type="number" value={year === 0 ? '' : year}
                           placeholder={'Year created'}
                           onChange={ev => setYear(Number(ev.target.value))}/>
                    <button id={'buttonCancelCreateSong'} type={'button'}
                            onClick={() => {
                                props.clear()
                            }}> <span className={'cancel'}>cancel</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateSongTitle
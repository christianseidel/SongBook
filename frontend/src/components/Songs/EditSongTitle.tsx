import React, {FormEvent, useState} from "react";
import {Song} from "./songModels";

interface SongItemProps {
    song: Song;
    updateDetailsView: () => void;
    onItemRevision: (song: Song) => void;
}
// TODO: I need to go via session storage in order to not loose entered data inadvertently
function EditSongTitle(props: SongItemProps) {

    const [title, setTitle] = useState(props.song.title);
    const [author, setAuthor] = useState(props.song.author);
    const [year, setYear] = useState(props.song.year);

    const doEditSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let responseStatus: number;
        fetch('api/songbook/' + props.song.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.song.id,
                title: title,
                author: author,
                year: year,
                dateCreated: props.song.dateCreated,
                resources: props.song.resources
            })
        })
            .then(response => {
                responseStatus = response.status;
                return response.json();
            })
            .then((responseBody: Song) => {
                if (responseStatus === 200) {
                    responseBody.status = 'display';
                    props.onItemRevision(responseBody);
                } else {
                    sessionStorage.setItem('messageType', 'red');
                    sessionStorage.setItem('message', 'An item with Id no. ' + props.song.id + ' could not be found.');
                }
            });
    }

    return (
        <div>
            <form onSubmit={ev => doEditSong(ev)}>
                <div className={'header'}>
                    <label>Title:</label>
                    <input id={'inputTitle'} type='text' value={title} placeholder={'Title'}
                           onChange={ev => setTitle(ev.target.value)} autoFocus required/>
                    <button id={'buttonCreate'} type='submit'> &#10004; update</button>
                    <br/>
                    <label>By:</label>
                    <input id={'inputAuthor'} type="text" value={author} placeholder={'Author'}
                           onChange={ev => setAuthor(ev.target.value)}/>
                    <label id={'labelYear'}>Year:</label>
                    <input className={'year'} type="number" value={(props.song.year !== '0') ? year : ''}
                           placeholder={'Year of Creation'}
                           onChange={ev => setYear(ev.target.value)}/>
                    <button id={'buttonCancel'} onClick={() => props.song.status = 'display'}> &#10008; cancel
                    </button>
                    <br/>
                </div>
            </form>
        </div>
    )
}

export default EditSongTitle
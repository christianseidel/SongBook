import React, {FormEvent, useState} from "react";
import {Song} from "../songModels";

interface SongItemProps {
    song: Song;
    updateDetailsView: () => void;
    onItemRevision: (song: Song) => void;
}
// TODO: I still need to go via session storage in order to not loose entered data inadvertently

function EditSongTitle(props: SongItemProps) {

    const [title, setTitle] = useState(props.song.title);
    const [author, setAuthor] = useState(props.song.author);
    const [year, setYear] = useState(props.song.year);
    // if (props.song.year === 0) {props.song.year = ''}

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
                references: props.song.references,
                description: props.song.description,
                links: props.song.links,
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
                <div>
                    <span id={'titleFirstLine'}>
                        <label>Title:</label>
                        <input id={'inputTitle'} type='text' value={title} placeholder={'Title'}
                               onChange={ev => setTitle(ev.target.value)} autoFocus required/>
                        <button id={'buttonUpdateSong'} type='submit'> &#10004; update</button>
                    </span>
                    <span id={'titleSecondLine'}>
                        <label>By:</label>
                        <input id={'inputAuthor'} type="text" value={author} placeholder={'Author'}
                               onChange={ev => setAuthor(ev.target.value)}/>
                        <label id={'labelInputYear'}>Year:</label>
                        <input id={'inputYear'} type="number" value={year === 0 ? '' : year}
                               placeholder={'Year created'}
                               onChange={ev => setYear(Number(ev.target.value))}/>
                        <button id={'buttonCancelEditSong'} onClick={
                            () => {
                                props.song.status = 'display';
                                props.updateDetailsView();
                            }
                        }> cancel
                        </button>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default EditSongTitle
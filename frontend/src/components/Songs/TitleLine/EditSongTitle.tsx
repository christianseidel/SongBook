import React, {FormEvent, useState} from "react";
import {message, MessageType, NewMessage} from "../../messageModel";
import {Song} from "../modelsSong";
import {useAuth} from "../../UserManagement/AuthProvider";

interface SongItemProps {
    song: Song;
    updateDetailsView: () => void;
    onItemRevision: (song: Song) => void;
    displayMsg: (msg: message) => void;
}
// TODO: I still need to go via session storage in order to not loose entered data inadvertently

function EditSongTitle(props: SongItemProps) {

    const {token} = useAuth();
    const [title, setTitle] = useState(props.song.title);
    const [author, setAuthor] = useState(props.song.author ?? '');
    const [year, setYear] = useState(props.song.year);

    const doEditSong = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch(`${process.env.REACT_APP_BASE_URL}/api/songbook/` + props.song.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
                if (response.status !== 200) {
                    throw Error ('Something unexpected happened! Error type: "' +
                        response.statusText + '". Error code: ' + response.status + '.')
                }
                return response.json();
            })
            .then((responseBody: Song) => {
                responseBody.status = 'display';
                props.onItemRevision(responseBody);
            })
            .catch(e => props.displayMsg(NewMessage.create(e.message, MessageType.RED)));
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
                        <label className={'labelSecondInLine'}>Year:</label>
                        <input id={'inputYear'} type="number" value={year === 0 ? '' : year}
                               placeholder={'Year created'}
                               onChange={ev => setYear(Number(ev.target.value))}/>
                        <button id={'buttonCancelEditSong'} type={'button'} onClick={
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
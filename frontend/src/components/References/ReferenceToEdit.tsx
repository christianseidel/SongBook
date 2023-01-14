import {songCollectionToRealName} from "../literals/collectionNames";
import '../styles/references.css';
import React, {FormEvent, useEffect, useState} from "react";
import {message, MessageType, NewMessage} from "../messageModel";
import {Reference} from "./modelsReference";
import {useAuth} from "../UserManagement/AuthProvider";
import {keys} from "../literals/keys";
import {Mood, Song} from "../Songs/songModels";
import hide from '../media/images/hide.png';
import {useSong} from "../Songs/SongProvider"

interface ReferenceItemProps {
    reference: Reference;
    doCancel: () => void;
    displayMsg: (msg: message | undefined) => void;
}

function ReferenceToEdit(props: ReferenceItemProps) {

    const {token} = useAuth();
    const {createSongFromReference} = useSong();
    const [title, setTitle] = useState(props.reference.title);
    const [page, setPage] = useState(props.reference.page !== 0 ? props.reference.page : '');
    const [author, setAuthor] = useState(props.reference.author == null ? '' : props.reference.author);
    const [year, setYear] = useState(props.reference.year !== 0 && props.reference.year !== undefined ? (props.reference.year).toString() : '');

    const [key, setKey] = useState('');
    const [mood, setMood] = useState(0);

    useEffect(() => {
        setKey(props.reference.key ?? '');
        setMood(Mood.checkIfMajorOrEmpty(props.reference.key) ? 0 : 1);
    }, [props.reference.key]);


    const updateReference = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // todo: implement error thrown. Here and elsewhere.
        let responseStatus: number;
        fetch(`${process.env.REACT_APP_BASE_URL}/api/collections/edit/` + props.reference.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: props.reference.id,
                title: title,
                songCollection: props.reference.songCollection,
                page: page,
                author: author,
                year: year,
                key: key,
                user: props.reference.user,
            })
        })
            .then(response => {
                responseStatus = response.status;
                return response.json();
            })
            .then((responseBody) => {
                if (responseStatus === 200) {
                    props.displayMsg(NewMessage.create(
                        'Your reference "' + title + '" was updated.',
                        MessageType.GREEN
                    ))
                } else {
                    props.displayMsg(NewMessage.create(responseBody.message, MessageType.RED));
                }
            })
            .then(props.doCancel)
    }

    const copyReference = (id: string) => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/collections/edit/` + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    // ToDo: check error logics
                    props.displayMsg(NewMessage.create(
                        'Your reference "' + props.reference.title + '" was copied.',
                        MessageType.GREEN));
                } else {
                    props.displayMsg(NewMessage.create(
                        'Oups! Something didn\'t work when trying to copy your reference' + response.text(),
                        MessageType.RED));
                    props.doCancel()
                }
            })
    }

    const hideReference = (id: string) => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/collections/edit/hide/` + id, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log('Reference "' + props.reference.title + '" now is hidden.');
                } else {
                    throw Error(response.statusText);
                }
            })
            .then(props.doCancel)
            .catch((e) =>
                props.displayMsg(NewMessage.create(e.message, MessageType.RED)))
    }

    const deleteReference = (id: string) => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/collections/edit/` + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                props.displayMsg(NewMessage.create(
                    'Your reference "' + props.reference.title + '" was deleted.',
                    MessageType.GREEN
                ));
            } else {
                throw Error(response.statusText);
            }
        })
            .then(props.doCancel)
            .catch((e) =>
                props.displayMsg(NewMessage.create(e.message, MessageType.RED)))
    }

    const doCreateSongFromReference = async (id: string) => {
        createSongFromReference(id)
            .then((result: Song) => {
                props.displayMsg(NewMessage.create('Your song "' + result.title
                    + '" was successfully created!', MessageType.GREEN));
            })
            .catch((e) => {
                props.displayMsg(NewMessage.create('Your reference could not be retrieved '
                    + 'from the server (error code: ' + e.status + ')', MessageType.RED))
            })

        props.doCancel();
        /*todo: I need to
           1) display the song just created
           2) re-render the list of songs*/
    }

    const checkIfEscapeKey = (key: string) => {
        if (key === "Escape") {
            props.doCancel()
        }
    }

    return (
        <div>
            <div id={'editReferenceItem'}>
                <h2>Update Your Reference</h2>
                <form onSubmit={ev => updateReference(ev)} className={'gridContainerReferenceToEdit'}>
                    <label id={'editRef_labelTitle'}>Title:</label>
                    <input id={'editRef_inputTitle'} type={'text'} value={title}
                           onChange={ev => setTitle(ev.target.value)} autoFocus required
                           onKeyDown={ev => checkIfEscapeKey(ev.key)}
                    />
                    <label id={'editRef_labelCollection'}>Coll.:</label>
                    <span id={'editRef_collection'}>{
                        props.reference.songCollection === "MANUALLY_ADDED_COLLECTION"
                            ? <span>{props.reference.addedCollection} <span
                                id={'labelManuallyAdded'}>(manually added)</span></span>
                            : <span>{songCollectionToRealName(props.reference.songCollection)}</span>
                    }</span>
                    <label id={'editRef_labelPage'}>Page:</label>
                    <input id={'editRef_inputPage'} type={'text'} placeholder={'Page'} value={page}
                           onChange={ev => setPage(ev.target.value)}
                           onKeyDown={ev => checkIfEscapeKey(ev.key)}/>
                    <label id={'editRef_labelAuthor'}>Author: </label>
                    <input id={'editRef_inputAuthor'} type={'text'} placeholder={'Author'} value={author}
                           onChange={ev => setAuthor(ev.target.value)}
                           onKeyDown={ev => checkIfEscapeKey(ev.key)}/>
                    <label id={'editRef_labelYear'}>Year: </label>
                    <input id={'editRef_inputYear'} type={'text'} placeholder={'Year'} value={year}
                           onChange={ev => setYear(ev.target.value)}
                           onKeyDown={ev => checkIfEscapeKey(ev.key)}/>


                    <label id={'editRef_labelKey'} htmlFor={'inputKey'}>Key:</label>
                    <div id={'editRef_majorOrMinor'}>
                        <select name={'inputKey'} id={'editRef_inputKey'}
                                value={key} onChange={ev => setKey(ev.target.value)}
                                tabIndex={5}>{keys.map((key) => (
                            <option value={key.mood[mood].value}
                                    key={key.mood[mood].value}>{key.mood[mood].label}</option>
                        ))}
                        </select>
                        <input type={'radio'} id={'editRef_inputMajor'} name={'majorOrMinor'}
                               value={0} className={'inputMajorOrMinor'} checked={mood === 0}
                               onChange={ev => {
                                   setMood(Number(ev.target.value));
                                   setKey('');
                               }} tabIndex={6}/>
                        <label htmlFor={'major'} id={'editRef_labelMajor'}>major</label>

                        <input type={'radio'} id={'editRef_inputMinor'} name={'majorOrMinor'}
                               value={1} className={'inputMajorOrMinor'} checked={mood === 1}
                               onChange={ev => {
                                   setMood(Number(ev.target.value));
                                   setKey('');
                               }}/>
                        <label htmlFor={'minor'} id={'editRef_labelMinor'}>minor</label>
                    </div>

                    <button id={'editRef_buttonUpdate'} type={'submit'}> &#10004; update</button>

                    <button id={'editRef_buttonCopy'} type={'button'}
                            onClick={() => copyReference(props.reference.id!)}>copy
                    </button>
                    <button id={'editRef_buttonCancel'} onClick={() => {
                        props.doCancel()
                    }}> cancel
                    </button>
                    <button id={'editRef_buttonHide'} type={'button'}
                            onClick={() => hideReference(props.reference.id!)}>
                        <img src={hide} alt='hide' id={'iconHide'}/>
                            hide
                    </button>
                    <button id={'editRef_buttonDelete'} type={'button'}
                            onClick={() => deleteReference(props.reference.id!)}>
                        &#10008; delete
                    </button>
                    <button id={'editRef_buttonCreateSong'} type={'button'}
                            onClick={() => doCreateSongFromReference(props.reference.id!)}>
                        &#10140; make it a song
                    </button>

                </form>

            </div>
        </div>
    )
}

export default ReferenceToEdit
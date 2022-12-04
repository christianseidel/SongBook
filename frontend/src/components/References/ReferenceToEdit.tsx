import {songCollectionToRealName} from "../literals/collectionNames";
import '../styles/references.css';
import '../styles/common.css';
import React, {FormEvent, useState} from "react";
import {message, MessageType, NewMessage} from "../messageModel";
import {Reference} from "./modelsReference";

interface ReferenceItemProps {
    reference: Reference;
    doCancel: () => void;
    displayMsg: (msg: message | undefined) => void;
}

function ReferenceToEdit(props: ReferenceItemProps) {

    const [title, setTitle] = useState(props.reference.title);
    const [page, setPage] = useState(props.reference.page !== 0 ? props.reference.page : '');
    const [author, setAuthor] = useState(props.reference.author == null ? '' : props.reference.author);
    const [year, setYear] = useState(props.reference.year !== 0 ? props.reference.year : '');

    const editReference = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let responseStatus: number;
        fetch('api/collections/edit/' + props.reference.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.reference.id,
                title: title,
                songCollection: props.reference.songCollection,
                page: page,
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
        fetch('api/collections/edit/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
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

    const deleteReference = (id: string) => {
        let responseStatus: number;
        fetch('api/collections/edit/' + id, {
            method: 'DELETE',
        }).then(response => {
            responseStatus = response.status;
            return response.json();
        })
            .then((responseBody) => {
            if (responseStatus === 200) {
                props.displayMsg(NewMessage.create(
                    'Your reference "' + props.reference.title + '" was deleted.',
                    MessageType.GREEN
                    ));
            } else {
                props.displayMsg(NewMessage.create(responseBody.message, MessageType.RED));
            }
        })
            .then(props.doCancel)
    }

    const checkIfEscapeKey = (key: string) => {
        if (key === "Escape") {
            props.doCancel()
        }
    }

    return(
        <div>
            <div  id={'editReferenceItem'}>
            <div>Update Your Reference:</div>
            <form onSubmit={ev => editReference(ev)}>
                <label>Titel: </label>
                <input className={'title'} id={'inputTitle'} type={'text'} value={title}
                       onChange={ev => setTitle(ev.target.value)} autoFocus required
                       onKeyDown={ev => checkIfEscapeKey(ev.key)}
                />
                <span id={'collectionTitle'}>{
                    props.reference.songCollection === "MANUALLY_ADDED_COLLECTION"
                        ? <span>{props.reference.addedCollection} <span id={'labelManuallyAdded'}>(manually added)</span></span>
                        : <span>{songCollectionToRealName(props.reference.songCollection)}</span>
                }</span><br/>
                <label>Page: </label>
                <input type={'text'} placeholder={'Page'} value={page}
                       onChange={ev => setPage(ev.target.value)}
                       onKeyDown={ev => checkIfEscapeKey(ev.key)}
                /><br />
                <label>Author: </label>
                <input type={'text'} placeholder={'Author'} value={author}
                       onChange={ev => setAuthor(ev.target.value)}
                       onKeyDown={ev => checkIfEscapeKey(ev.key)}
                /><br />
                <label>Year: </label>
                <input type={'text'}  placeholder={'Year'} value={year}
                       onChange={ev => setYear(ev.target.value)}
                       onKeyDown={ev => checkIfEscapeKey(ev.key)}
                /><br />
                <button type='submit'> &#10004; update</button>
            </form>
            <div>
                <span id={'buttonDeleteReference'}><button type={'button'} onClick={() => deleteReference(props.reference.id!)}>&#10008; delete</button></span>
            </div>
            <div>
                <span id={'buttonCopyReference'}><button type={'button'} onClick={() => copyReference(props.reference.id!)}>&#10004; copy</button></span><br />
            </div>
            <div>
                <button onClick={() => {props.doCancel()}}> &#10008; cancel</button>
            </div>
            </div>

        </div>
    )
}

export default ReferenceToEdit
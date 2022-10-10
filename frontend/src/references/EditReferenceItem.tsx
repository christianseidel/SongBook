import {Reference, ReferencesDTO} from "./ReferenceModels";
import '../styles/references.css';
import '../styles/common.css';
import React, {FormEvent, useState} from "react";

interface ReferenceItemProps {
    reference: Reference;
    onCancel: () => void;
}

function EditReferenceItem(props: ReferenceItemProps) {

    const [title, setTitle] = useState(props.reference.title);
    const [page, setPage] = useState(props.reference.page != '0' ? props.reference.page : '');
    const [author, setAuthor] = useState(props.reference.author == null ? '' : props.reference.author);
    const [year, setYear] = useState(props.reference.year != '0' ? props.reference.year : '');

    const editReference = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        fetch('api/collections/edit/' + props.reference.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: props.reference.id,
                title: title,
                volume: props.reference.volume,
                page: page,
                author: author,
                year: year,
            })
        }).then(props.onCancel);
    }

    const copyReference = (id: string) => {
        fetch('api/collections/edit/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
        }).then(response => {
            if (response.ok) {
                alert('Your Song "' + props.reference.title + '" was copied.') // ToDo
            }
        })
            .then(props.onCancel)
            .catch(e => alert('Fehler in der Copy-Methode! ' + e));
    }

    const deleteReference = (id: string) => {
        fetch('api/collections/edit/' + id, {
            method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                alert('Your Song "' + props.reference.title + '" was deleted.') // ToDo
            }
        })
            .then(props.onCancel)
            .catch(e => alert('Fehler in der Delete-Methode! ' + e));
    }

    return(
        <div>
            <div>Update Your Reference:</div>
            <form onSubmit={ev => editReference(ev)}>
                <label>Titel: </label>
                <input className={'title'} id={'inputTitle'} type={'text'} value={title}
                       onChange={ev => setTitle(ev.target.value)} autoFocus required/>

                <span>{props.reference.volume}</span><br/>
                <label>Page: </label>
                <input type={'text'} placeholder={'Page'} value={page}
                       onChange={ev => setPage(ev.target.value)}/><br />
                <label>Author: </label>
                <input type={'text'} placeholder={'Author'} value={author}
                       onChange={ev => setAuthor(ev.target.value)}/><br />
                <label>Year: </label>
                <input type={'text'}  placeholder={'Year'} value={year}
                       onChange={ev => setYear(ev.target.value)}/><br />
                <button type='submit'> &#10004; update</button>
            </form>
            <div>
                <span id={'buttonDeleteReference'}><button onClick={() => deleteReference(props.reference.id)}>&#10008; delete</button></span>
            </div>
            <div>
                <span id={'buttonCopyReference'}><button onClick={() => copyReference(props.reference.id)}>&#10004; copy</button></span><br />
            </div>
            <div>
                <button onClick={() => {props.onCancel()}}> &#10008; cancel</button>
            </div>
        </div>
    )
}

export default EditReferenceItem
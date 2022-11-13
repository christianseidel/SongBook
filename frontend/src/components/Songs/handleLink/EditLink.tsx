import React, {FormEvent, useEffect, useState} from "react";
import '../../styles/songDetails.css'
import {Link} from "../songModels";

interface SongItemLinksProps {
    link: Link;
    saveLink: () => void;
    onCancel: () => void;
    onDeletion: () => void;
}

function EditLink (props: SongItemLinksProps) {

    const [linkText, setLinkText] = useState(sessionStorage.getItem('linkText') ?? '');
    useEffect(() => {
        sessionStorage.setItem('linkText', linkText)}, [linkText]);

    const [linkTarget, setLinkTarget] = useState(sessionStorage.getItem('linkTarget') ?? '');
    useEffect(() => {
        sessionStorage.setItem('linkTarget', linkTarget)}, [linkTarget]);

    const doUpdateLink = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        props.link.linkText = linkText;

        let finalTarget = linkTarget;
        if (linkTarget.slice(0, 4) !== 'http') {
            finalTarget = 'https://' + finalTarget;
        }
        props.link.linkTarget = finalTarget;
        props.saveLink();
    }

    return (
        <form id={'inputFormLink'} onSubmit={ev => doUpdateLink(ev)}>
            <label>Edit your Link:</label>
            <span id={'secondLineLink'}>
                        <label>Text:</label>
                        <input id={'inputLinkText'} type='text' value={linkText} placeholder={'Link Description'}
                               onChange={ev => setLinkText(ev.target.value)} required/>
                        <button id={'buttonUpdateLink'} type='submit'>
                            &#10004; update
                        </button><br />
                        <label>Target:</label>
                        <input id={'inputLinkTarget'} type='text' value={linkTarget} placeholder={'Link Target'}
                               onChange={ev => setLinkTarget(ev.target.value)} required/>
                        <button id={'buttonCancelAddLink'} type={'button'} onClick={() => props.onCancel()}
                        > cancel
                        </button>
                        <br />
                        <button id={'buttonDeleteLink'} type={'button'} onClick={() => props.onDeletion()}>
                            &#10008; delete
                        </button>
                    </span>
        </form>
    )
}

export default EditLink
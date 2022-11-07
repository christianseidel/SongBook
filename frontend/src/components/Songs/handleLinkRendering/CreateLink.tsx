import React, {FormEvent, useEffect, useState} from "react";
import '../../styles/songDetails.css'
import {Link} from "../songModels";

interface SongItemLinksProps {
    links: Link[] | undefined;
    onCreation: () => void;
    onCancel: () => void;
}

function EditLink (props: SongItemLinksProps) {

    const [linkText, setLinkText] = useState(sessionStorage.getItem('linkText') ?? '');
    useEffect(() => {
        sessionStorage.setItem('linkText', linkText)}, [linkText]);

    const [linkTarget, setLinkTarget] = useState(sessionStorage.getItem('linkTarget') ?? '');
    useEffect(() => {
        sessionStorage.setItem('linkTarget', linkTarget)}, [linkTarget]);

    const doCreateLink = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let finalTarget = linkTarget;
        if (linkTarget.slice(0, 4) !== 'http') {
            finalTarget = 'https://' + finalTarget;
        }
        let link = new Link(linkText, finalTarget);
        if (props.links !== undefined) {
            let next: number;
            next = props.links.length;
            props.links[next] = link;
        } else {
            alert("the resources array is undefined!");
            console.log("the resources array is undefined!");
        }
        props.onCreation();
    }

    return (
        <form id={'inputFormLink'} onSubmit={ev => doCreateLink(ev)}>
            <label>Add a Link:</label>
            <span id={'secondLineLink'}>
                        <label>Text:</label>
                        <input id={'inputLinkText'} type='text' value={linkText} placeholder={'Link Description'}
                               onChange={ev => setLinkText(ev.target.value)} required/>
                        <button id={'buttonUpdateLink'} type='submit'>
                            &#10004; create
                        </button><br />
                        <label>Target:</label>
                        <input id={'inputLinkTarget'} type='text' value={linkTarget} placeholder={'Link Target'}
                               onChange={ev => setLinkTarget(ev.target.value)} required/>
                        <button id={'buttonCancelAddLink'} onClick={() => props.onCancel()}
                            > &#10008; cancel
                        </button>
                    </span>
        </form>
    )
}

export default EditLink
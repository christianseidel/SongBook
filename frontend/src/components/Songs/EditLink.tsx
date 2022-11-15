import React, {FormEvent, useEffect, useState} from "react";
import '../styles/songDetails.css'
import {Link} from "./songModels";
import {keys} from "../literals/keys";

interface SongItemLinksProps {
    toggleCreateOrUpdate: string
    links: Link[] | undefined;
    linkIndex: number;
    returnAndSave: () => void;
    onCancel: () => void;
    onClear: () => void;
}

function EditLink(props: SongItemLinksProps) {

    const [linkText, setLinkText] = useState(sessionStorage.getItem('linkText') ?? '');
    useEffect(() => {
        sessionStorage.setItem('linkText', linkText)
    }, [linkText]);
    const [linkTarget, setLinkTarget] = useState(sessionStorage.getItem('linkTarget') ?? '');
    useEffect(() => {
        sessionStorage.setItem('linkTarget', linkTarget)
    }, [linkTarget]);
    const [key, setKey] = useState('');
    const [mood, setMood] = useState(0);
    const [strumming, setStrumming] = useState(sessionStorage.getItem('linkStrumming') ?? '');

    const createLink = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        console.log("create link");
        let finalTarget = linkTarget;
        if (linkTarget.slice(0, 4) !== 'http') {
            finalTarget = 'https://' + finalTarget;
        }
        let link = new Link(linkText, finalTarget, key, strumming);
        if (props.links !== undefined) {
            let next: number;
            next = props.links.length;
            props.links[next] = link;
        } else {
            alert("the resources array is undefined!");
            console.log("the resources array is undefined!");
        }
        props.returnAndSave();
    }

    const doUpdateLink = () => {
        if (props.links !== undefined) {
            let link: Link = props.links[props.linkIndex];
            link.linkText = linkText;
            let finalTarget = linkTarget;
            if (linkTarget.slice(0, 4) !== 'http') {
                finalTarget = 'https://' + finalTarget;
            }
            link.linkTarget = finalTarget;
            link.linkKey = key;
            link.linkStrumming = strumming;
            props.links[props.linkIndex] = link;
        } else {
            console.log("ERROR: props.song.links is \"undefined\"!?")
        }
        clearLink();
        console.log("update fertig")
        props.returnAndSave();
    }

    const doClearLink = () => {
        clearLink();
        if (document.getElementById('inputRefCollection') != null) {
            document.getElementById('inputRefCollection')!.className = '';
        }
        props.onClear();
    }

    const clearLink = () => {
        setLinkText('')
        setLinkTarget('');
        setKey('');
        setMood(0);
        setStrumming('');
    }


    const deleteLink = () => {
        props.links!.splice(props.linkIndex, 1);
        props.returnAndSave();
    }

    return (
        <div>
            <form id={'inputFormLink'} onSubmit={ev => {
                props.toggleCreateOrUpdate === 'create' ? createLink(ev) : doUpdateLink();
            }} className={'workingSpaceElement'}>
                <label>{props.toggleCreateOrUpdate === 'create' ? <span>Add a</span> :
                    <span>Edit your</span>} Link:</label>
                <span id={'secondLineKey'}>
                            <label>Text:</label>
                            <input id={'inputLinkText'} type='text' value={linkText} placeholder={'Link Description'}
                                   onChange={ev => setLinkText(ev.target.value)} autoFocus tabIndex={1} required/>
                            <button id={'buttonEditLink'} type='submit' tabIndex={3}>
                                &#10004; {props.toggleCreateOrUpdate === 'create' ? <span>create</span> :
                                <span>update</span>}
                            </button><br/>
                            <label>Target:</label>
                            <input id={'inputLinkTarget'} type='text' value={linkTarget} placeholder={'Link Target'}
                                   onChange={ev => setLinkTarget(ev.target.value)} tabIndex={2} required/>
                                <br/>
                        </span>
                <span id={'fourthLineKey'}>
                            <label htmlFor={'inputKey'}>Key:</label>
                                <select name={'inputKey'} id={'inputKey'} form={'inputFormRef'}
                                        value={key} onChange={ev => setKey(ev.target.value)}
                                        tabIndex={3}>{keys.map((songKey) => (
                                    <option value={songKey.mood[mood].value}
                                            key={songKey.mood[mood].value}>{songKey.mood[mood].label}</option>
                                ))}
                            </select>
                            <input type={'radio'} id={'major'} name={'majorOrMinor'}
                                   value={0} className={'inputMajorOrMinor'} checked={mood === 0}
                                   onChange={ev => {
                                       setMood(Number(ev.target.value));
                                       setKey('');
                                   }} tabIndex={4}/>
                            <label htmlFor={'major'} className={'labelInputMajorOrMinor'}>major</label>
                            <input type={'radio'} id={'minor'} name={'majorOrMinor'}
                                   value={1} className={'inputMajorOrMinor'} checked={mood === 1}
                                   onChange={ev => {
                                       setMood(Number(ev.target.value));
                                       setKey('');
                                   }}/>
                            <label htmlFor={'minor'} className={'labelInputMajorOrMinor'}>minor</label>
                            <button id={'buttonCancelEditLink'} type='button' onClick={() => {
                                props.onCancel()
                            }}
                                    tabIndex={6}>
                                cancel
                            </button>
                        </span>
            </form>
            <button id={'buttonClearLink'} type='button' onClick={() => {
                doClearLink()
            }} tabIndex={9}>
                ! clear
            </button>
            {props.toggleCreateOrUpdate === 'update' &&
                <button id={'buttonDeleteLink'} type='button' onClick={() => {
                    deleteLink()
                }}>
                    &#10008; delete
                </button>}
        </div>
    )

}

export default EditLink
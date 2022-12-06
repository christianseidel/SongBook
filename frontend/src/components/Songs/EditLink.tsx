import React, {FormEvent, useEffect, useState} from "react";
import '../styles/songDetails.css'

import ChooseKey from "./ChooseKey";
import {Link, Mood} from "./modelsSong";

interface SongItemLinksProps {
    toggleCreateOrUpdate: string;
    links: Link[] | undefined;
    linkIndex: number;
    returnAndSave: () => void;
    onCancel: () => void;
    onClear: () => void;
}

function EditLink(props: SongItemLinksProps) {

    const [linkText, setLinkText] = useState('');
    const [linkTarget, setLinkTarget] = useState('');
    const [linkAuthor, setLinkAuthor] = useState('');
    const [strumming, setStrumming] = useState('');
    const [songKey, setSongKey] = useState('');
    const [songKeyReturned, setSongKeyReturned] = useState('')
    const [songMood, setSongMood] = useState(0);

    const clearLink = () => {
        setLinkText('')
        setLinkTarget('');
        setSongKey('');
        setLinkAuthor('')
        setStrumming('');
    }

    useEffect(() => {
        if (props.toggleCreateOrUpdate === 'update' && props.links) {
            setLinkText(props.links[props.linkIndex].linkText);
            setLinkTarget(props.links[props.linkIndex].linkTarget);
            setLinkAuthor(props.links[props.linkIndex].linkAuthor);
            setStrumming(props.links[props.linkIndex].linkStrumming);
            setSongKey(props.links[props.linkIndex].linkKey ?? ``);
            setSongMood(Mood.checkIfMajorOrEmpty(songKey) ? 0 : 1);
        }
    }, [props.linkIndex, props.links, props.toggleCreateOrUpdate, songKey]);

    const doCreateLink = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let finalTarget = linkTarget;
        if (linkTarget.slice(0, 4) !== 'http') {
            finalTarget = 'https://' + finalTarget;
        }
        let link = new Link(linkText, finalTarget, songKeyReturned, linkAuthor, strumming);
        if (props.links !== undefined) {
            let next: number;
            next = props.links.length;
            props.links[next] = link;
        }
        clearLink();
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
            link.linkAuthor = linkAuthor;
            link.linkStrumming = strumming;
            link.linkKey = songKeyReturned;
            props.links[props.linkIndex] = link;
        }
        clearLink();
        props.returnAndSave();
    }

    const doClearLink = () => {
        clearLink();
        props.onClear();
    }

    const deleteLink = () => {
        props.links!.splice(props.linkIndex, 1);
        clearLink();
        props.returnAndSave();
    }

    return (
        <div>
            <form id={'inputFormLink'} onSubmit={ev => {
                props.toggleCreateOrUpdate === 'create' ? doCreateLink(ev) : doUpdateLink();
            }}>
                <label className={'editLinkTitle'}>{props.toggleCreateOrUpdate === 'create'
                    ? <span>Add a</span>
                    : <span>Edit your</span>} Link</label><label>:</label>
                <span className={'nextLine'}>
                    <label>Text:</label>
                    <input id={'inputLinkText'} type='text' value={linkText} placeholder={'Link Description'}
                           onChange={ev => setLinkText(ev.target.value)} autoFocus tabIndex={1} required/>
                    <label className={'labelSecondInLine'}>Target:</label>
                    <input id={'inputLinkTarget'} type='text' value={linkTarget} placeholder={'Link Target'}
                           onChange={ev => setLinkTarget(ev.target.value)} tabIndex={2} required/>
                    <button id={'buttonEditLink'} type='submit' tabIndex={7}>
                        &#10004; {props.toggleCreateOrUpdate === 'create'
                        ? <span>create</span>
                        : <span>update</span>}
                    </button>
                </span>

                <span className={'nextLine'}>
                    <label>Author:</label>
                    <input id={'inputLinkAuthor'} type='text' value={linkAuthor} placeholder={'Author'}
                           onChange={ev => setLinkAuthor(ev.target.value)} tabIndex={3}/>
                    <label className={'labelSecondInLine'}>Strm.: </label>
                    <input id={'inputLinkStrumming'} type='text' value={strumming} placeholder={'d- -D-u- -u-D-u-'}
                           onChange={ev => setStrumming(ev.target.value)} tabIndex={4}/>
                </span>

                <ChooseKey
                    songKey={songKey}
                    songMood={songMood}
                    onCancel={props.onCancel}
                    sendUpKey={(key: string) => setSongKeyReturned(key)}
                />
            </form>

            <button id={'buttonClearLink'} type='button' onClick={() => {
                doClearLink()
            }} tabIndex={9}>
                ! clear
            </button>
            {props.toggleCreateOrUpdate === 'update' &&
                <button id={'buttonDeleteLink'} type='button' onClick={() => {
                    deleteLink()
                }} tabIndex={10}>
                    &#10008; delete
                </button>}
        </div>
    )
}

export default EditLink
import {Song} from './songModels'
import '../styles/common.css'
import '../styles/songDetails.css'
import React, {FormEvent, useEffect, useState} from "react";
import DisplayMessageSongs from "./DisplayMessageSongs";
import EditSongTitle from "./handleTitleLine/EditSongTitle";
import CreateSongTitle from "./handleTitleLine/CreateSongTitle";
import DisplaySongTitle from "./handleTitleLine/DisplaySongTitle";
import {Reference, songCollectionToRealName} from "../References/referenceModels";
import DisplayLinks from "./handleLinkRendering/DisplayLinks";
import EditLink from "./handleLinkRendering/EditLink";
import CreateLink from "./handleLinkRendering/CreateLink";

interface SongItemProps {
    song: Song;
    onItemDeletion: (message: string) => void;
    onItemCreation: (message: string) => void;
    onItemRevision: (song: Song) => void;
    doReturn: () => void;
    clear: () => void;
}

function SongItemDetailsView(props: SongItemProps) {

    const [songState, setSongState] = useState(props.song.status);
    const [message, setMessage] = useState('');
    useEffect(() => setSongState(props.song.status), [props.song.status]);

    const [description, setDescription] = useState(sessionStorage.getItem('description') ?? '');
    useEffect(() => {
        sessionStorage.setItem('description', description)
    }, [description]);

    const [displayDescription, setDisplayDescription] = useState(true);
    const [toggleAddDescription, setToggleAddDescription] = useState(false);
    const [toggleAddReference, setToggleAddReference] = useState(false);
    const [toggleAddLink, setToggleAddLink] = useState(false);
    const [toggleAddSongSheet, setToggleAddSongSheet] = useState(false);


    useEffect(() => {
        setToggleAddDescription(false);
        setToggleAddReference(false);
        setToggleAddLink(false);
        setToggleAddSongSheet(false);
    }, [props.song.title]);

    useEffect(() => {
        if (!toggleAddDescription && !toggleAddReference && !toggleAddLink && !toggleAddSongSheet) {
            setDisplayDescription(true);
        } else {
            setDisplayDescription(false);
        }
    }, [toggleAddDescription, toggleAddReference, toggleAddLink, toggleAddSongSheet]);


    // controls rendering of the first two lines within Song Details View //
    let handelTitleLine;
    if (songState === 'display') {
        handelTitleLine = <DisplaySongTitle
            song={props.song}
            updateDetailsView={() => setSongState(props.song.status)}
            clear={props.clear}
        />;
    } else if (songState === 'edit') {
        handelTitleLine = <EditSongTitle
            song={props.song}
            updateDetailsView={() => setSongState(props.song.status)}
            onItemRevision={(song) => props.onItemRevision(song)}
        />;
    } else if (songState === 'create') {
        handelTitleLine = <CreateSongTitle
            song={props.song}
            onItemCreation={(song) => props.onItemRevision(song)}
            clear={props.clear}
        />;
    }

    function deleteSong(id: string) {
        unhideAllReferencesAttached(id)
            .then(() => {
                    fetch('/api/songbook/' + id, {
                        method: 'DELETE'
                    })
                        .then(response => {
                            if (response.ok) {
                                sessionStorage.setItem('messageType', 'green');
                                sessionStorage.setItem('message', 'Your song "' + props.song.title + '" was deleted!');
                            } else {
                                sessionStorage.setItem('messageType', 'red');
                                sessionStorage.setItem('message', 'Your song could not be deleted!');
                            }
                        })
                        .then(props.doReturn);
                }
            )
    }

    // function needs work asynchronous for references need to be
    // repatriated first before song can then be deleted //
    const unhideAllReferencesAttached = (songId: string) => {
        return new Promise((resolve) => {
            resolve(
                fetch('api/songbook/unhideReferences/' + songId, {
                    method: 'PUT'
                })
                    .then(response => {
                        return response.json();
                    })
            );
        })
    }

    function saveSongItem() {
        let responseStatus: number;
        fetch('api/songbook/' + props.song.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: props.song.id,
                title: props.song.title,
                author: props.song.author,
                dateCreated: props.song.dateCreated,
                year: props.song.year,
                description: props.song.description,
                references: props.song.references,
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
                    sessionStorage.setItem('message', 'The item Id no. ' + props.song.id + ' could not be saved.');
                }
            });
    }


    // --- DESCRIPTION ELEMENTS --- //

    const openOrCloseAddDescription = () => {
        setToggleAddDescription(!toggleAddDescription);
        setToggleAddReference(false);
        setToggleAddLink(false);
        setLinkRendering('display');
        setToggleAddSongSheet(false);
        setDescription(props.song.description ?? '');
    }

    const doAddDescription = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        props.song.description = description;
        saveSongItem();
        setToggleAddDescription(false);
        setDescription('');
        sessionStorage.removeItem('description');
    }

    const doClearDescription = () => {
        setDescription('');
        props.song.description = '';
        sessionStorage.removeItem('description');
        saveSongItem();
    }


    // --- REFERENCES ELEMENTS --- //

    const openOrCloseAddReference = () => {
        setToggleAddDescription(false);
        setToggleAddLink(false);
        setToggleAddSongSheet(false);
        setLinkRendering('display');
        setToggleAddReference(!toggleAddReference);
    }

    const [collection, setCollection] = useState('');
    const [page, setPage] = useState('');

    const doAddReference = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        let next: number;
        let reference = new Reference(props.song.title, collection, Number(page));
        if (props.song.references !== undefined) {
            next = props.song.references.length;
            props.song.references[next] = reference;
        } else {
            alert("the resources array is undefined!");
            console.log("the resources array is undefined!");
        }
        saveSongItem();
        setToggleAddReference(false);
        setCollection('');
        setPage('');
    }

    const editItem = (id: string) => {
        alert("spass muss sein " + id);
    }


    // --- LINK ELEMENTS --- //

    const openOrCloseAddLink = () => {
        setToggleAddDescription(false);
        setToggleAddReference(false);
        setToggleAddSongSheet(false);
        setToggleAddLink(!toggleAddLink);
        setLinkRendering('display');
        sessionStorage.setItem('linkText', '');
        sessionStorage.setItem('linkTarget', '');
    }

    // Display OR Edit Existing Links  // value may be 'display' or 'edit'
    const [linkRendering, setLinkRendering] = useState('display');
    useEffect(() => {
        setLinkRendering('display')
    }, [props.song.title]);

    let handleLinkRendering;  // controls rendering of Link Data
    const [linkIndex, setLinkIndex] = useState(0)
    if (linkRendering === 'display') {
        handleLinkRendering = <DisplayLinks
            links={props.song.links}
            doEditLink={(index) => {
                setLinkIndex(index);
                setToggleAddLink(false);
                setLinkRendering('edit');
            }}
        />;
    }
    if (linkRendering === 'edit') {
        handleLinkRendering = <EditLink
            link={props.song.links![linkIndex]}
            saveLink={
                () => {
                    saveSongItem();
                    setLinkRendering('display');
                }}
            onCancel={() => setLinkRendering('display')}
            onDeletion={
                () => {
                    props.song.links!.splice(linkIndex, 1);
                    saveSongItem();
                    setLinkRendering('display');
                }}
        />;
    }


    // --- SONG SHEET FILES --- //

    const openOrCloseAddSongSheet = () => {
        setToggleAddDescription(false);
        setToggleAddReference(false);
        setToggleAddSongSheet(!toggleAddSongSheet);
        setToggleAddLink(false);
        setLinkRendering('display');
        sessionStorage.setItem('linkText', '');
        sessionStorage.setItem('linkTarget', '');
    }

    return (
        <div>
            <div id={'songHead'} className={'songDataSheetElement'}>
                <div>{handelTitleLine}</div>
            </div>

            <div id={'iconContainer'}>
                    <span className={'icon tooltip'} id={'iconInfo'} onClick={openOrCloseAddDescription}>
                        i
                        <span className="tooltipText">add a description</span>
                    </span>
                <span className={'icon tooltip'} id={'iconReference'} onClick={openOrCloseAddReference}>
                        R
                        <span className="tooltipText">add a song sheet reference</span>
                    </span>
                <span className={'icon tooltip'} id={'iconLink'} onClick={openOrCloseAddLink}>
                        &#8734;
                    <span className="tooltipText">add a link</span>
                    </span>
                <span className={'icon tooltip'} id={'iconFile'} onClick={openOrCloseAddSongSheet}>
                        &#128195;
                    <span className="tooltipText">add a file</span>
                    </span>
            </div>

            <div id={'workingSpace'} className={'songDataSheetElement'}>
                {props.song.description && !toggleAddDescription && displayDescription &&
                    <div id={'displayDescription'} className={'workingSpaceElement'}
                         onClick={openOrCloseAddDescription}>
                        {props.song.description}
                    </div>
                }

                {toggleAddDescription && <div>
                    <form id={'addADescription'} className={'workingSpaceElement'}
                          onSubmit={ev => doAddDescription(ev)}>
                        <label>{((props.song.description !== null
                            && props.song.description!.length > 0) && true)
                            ? <span>Edit your </span>
                            : <span>Add a </span>} Comment or Description:</label><br/>
                        <textarea id={'inputDescription'} value={description}
                                  rows={3}
                                  cols={60}
                                  placeholder={'your description here...'}
                                  onChange={ev => setDescription(ev.target.value)} autoFocus required/>
                        <button id={'buttonAddDescription'} type='submit'>
                            &#10004; {(props.song.description !== null && props.song.description!.length > 0)
                            ? <span>update</span>
                            : <span>add</span>} </button>
                    </form>
                    <button id={'buttonCancelAddDescription'} onClick={openOrCloseAddDescription}>
                        cancel
                    </button>
                    <button id={'buttonClearDescription'} type='submit' onClick={doClearDescription}>
                        ! clear
                    </button>
                </div>}


                {toggleAddReference && <div>
                    <form id={'inputFormRef'} onSubmit={ev => doAddReference(ev)}>
                        <label>Add a Song Sheet Reference:</label>
                        <button id={'buttonUpdateReference'} className={'workingSpaceElement'}
                                type='submit'> &#10004; update
                        </button>
                        <br/>
                        <span id={'secondLineRef'}>
                        <label>Coll.:</label>
                        <input id={'inputRefCollection'} type='text' value={collection}
                               placeholder={'Song Collection'}
                               onChange={ev => setCollection(ev.target.value)} required/>
                        <label id={'labelInputRefPage'}>Page:</label>
                        <input id={'inputRefPage'} type='number' value={page} placeholder={'Page'}
                               onChange={ev => setPage(ev.target.value)} required/>
                        <button id={'buttonCancelAddReference'} onClick={
                            () => {
                                props.song.status = 'display';
                                setToggleAddReference(false);
                            }
                        }> cancel
                        </button>
                    </span>
                    </form>
                </div>}


                {toggleAddLink && <CreateLink
                    links={props.song.links}
                    onCancel={() => setToggleAddLink(false)}
                    onCreation={
                        () => {
                            saveSongItem();
                            setToggleAddLink(false);
                        }}
                />}


                {toggleAddSongSheet && <div id={'songSheetForm'} className={'workingSpaceElement'}>
                    <b>-&gt; hier</b> kommt dann noch ein Feld zum Dateihochladen...
                </div>
                }

            </div>

            <div id={'displaySpace'} className={'songDataSheetElement'}>
                {props.song.references !== undefined && props.song.references.length > 0
                    && !toggleAddReference &&  // display References
                    <div className={'displayReferences'}>
                        <div id={'listOfReferences'}>
                            {props.song.references.map((item, index) =>
                                <div key={index} className={'retainedReferenceItem'}
                                     onClick={() => editItem(item.title)}>
                                    &ndash;&#129174;&nbsp; {(item.addedCollection === null) ?
                                    <span>{songCollectionToRealName(item.songCollection)}</span> :
                                    <span>{item.addedCollection}</span>}
                                    {item.page !== 0 && <span>, page {item.page}</span>}
                                </div>)}
                        </div>
                    </div>}

                <div>
                    <div>{handleLinkRendering}</div>
                </div>

            </div>

            <div id={'songFooter'}>
                created: {props.song.dayOfCreation.day}.
                {props.song.dayOfCreation.month}.
                {props.song.dayOfCreation.year}
            </div>
            <span id={'buttonDeleteSong'}>
                <button onClick={() => deleteSong(props.song.id)}>
                    &#10008; delete
                </button>
            </span>

            <div>
                {message && <DisplayMessageSongs
                    message={message}
                    onClose={() => {
                        setMessage('');
                        sessionStorage.setItem('message', '');
                        sessionStorage.removeItem('messageType')
                    }}
                />}
            </div>
        </div>
    )
}

export default SongItemDetailsView

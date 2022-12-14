import React from "react";
import {Song} from "../songModels";

interface SongItemProps {
    song: Song;
    updateDetailsView: () => void;
    onClear: () => void;
}

function DisplaySongTitle(props: SongItemProps) {

    return (
        <div>
            <div id={'displayTitle'}>
                <span>{props.song.title}</span>
                <span id={'buttonEditSong'}>
                            <button type={'button'} onClick={() => {
                                props.song.status = 'edit';
                                props.updateDetailsView();
                            }}>
                                <div className={'edit'}>&#9998;</div> edit
                            </button>
                        </span>
            </div>
            <div id={'displayTitleSecondLine'}>
                {props.song.author && <label id={'labelDisplayAuthor'}>By:</label>}
                {props.song.author && <span id={'displayAuthor'}> {props.song.author} </span>}
                {(props.song.year !== 0) && <label>Year:</label>}
                {(props.song.year !== 0) && <span id={'displayYear'}> {props.song.year} </span>}
                <button id={'buttonCloseDisplaySong'} type={'button'} onClick={() => {
                        props.onClear();
                    }}>
                    close
                    </button>
            </div>
        </div>
    )
}
export default DisplaySongTitle
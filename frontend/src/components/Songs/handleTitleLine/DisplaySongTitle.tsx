import React from "react";
import {Song} from "../songModels";

interface SongItemProps {
    song: Song;
    updateDetailsView: () => void;
    clear: () => void;
}

function DisplaySongTitle(props: SongItemProps) {

    return (
        <div>
            <div id={'displayTitle'}>
                <span>{props.song.title}</span>
                <span id={'buttonEditSong'}>
                            <button onClick={() => {
                                props.song.status = 'edit';
                                props.updateDetailsView();
                            }}>
                                <div className={'edit'}>&#9998;</div> edit
                            </button>
                        </span>
            </div>
            <div id={'test'}>
                {props.song.author && <label>By:</label>}
                {props.song.author && <span id={'displayAuthor'}> {props.song.author} </span>}
                {(props.song.year !== 0) && <label>Year:</label>}
                {(props.song.year !== 0) && <span id={'displayYear'}> {props.song.year} </span>}
                <button id={'buttonCancelDisplaySong'} onClick={() => {
                        props.clear();
                    }}>
                    close
                    </button>
            </div>
        </div>
    )
}
export default DisplaySongTitle
import React from "react";
import {Song} from "./songModels";

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
                                &#8734; edit &nbsp;
                            </button>
                        </span>
            </div>
            <div id={'test'}>
                {props.song.author && <label>By:</label>}
                {props.song.author && <span id={'displayAuthor'}> {props.song.author} </span>}
                {(props.song.year != '0') && <label>Year:</label>}
                {(props.song.year != '0') && <span id={'displayYear'}> {props.song.year} </span>}
                <button id={'buttonCancelDisplaySong'} onClick={() => {
                        props.clear();
                    }}>
                    &#10008; cancel
                    </button>
            </div>
        </div>
    )
}

// ToDo: Somehow the cancel button doesn't get activated -- if there is no author and no year...

export default DisplaySongTitle
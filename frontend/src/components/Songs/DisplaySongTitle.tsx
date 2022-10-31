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
            <div id={'displayAuthorAndYear'}>
                {props.song.author && <span className={'displaySongItem'}>By:</span>} {props.song.author &&
                <span id={'displayAuthor'}> {props.song.author} </span>}
                {(props.song.year != '0') &&
                    <span>&nbsp;&nbsp;&nbsp;<label>Year:</label></span>} {(props.song.year != '0') &&
                <span id={'displayYear'}> {props.song.year}</span>}
                <span id={'buttonCancelSong'}>
                            <button onClick={() => {
                                props.clear();
                            }}>
                                &#10008; cancel
                            </button>
                        </span>
            </div>
        </div>
    )
}

// ToDo: Somehow the cancel button doesn't get activated -- if there is no author and no year...

export default DisplaySongTitle
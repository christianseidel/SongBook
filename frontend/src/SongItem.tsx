import {Song} from './models'
import './styles/songs.css'
import {useState} from "react";

interface SongItemProps {
    song: Song
    onItemMarked: (id: string) => void;
}

function SongItem(props: SongItemProps) {

    const [song, setSong] = useState({} as Song)

    const chooseSong = () => props.onItemMarked(props.song.id);

    return (
        <div>
            <div onClick={chooseSong}>
                &#8226; {props.song.title}
            </div>
        </div>
    )
}

export default SongItem
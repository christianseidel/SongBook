import {Song} from './models'
import './styles/songs.css'

interface SongItemProps {
    song: Song
    onItemMarked: (id: string) => void;
}

function SongItem(props: SongItemProps) {

    const chooseSong = () => props.onItemMarked(props.song.id);

    return (
        <div>
            <div onClick={chooseSong}>
                &#129174; {props.song.title}
            </div>
        </div>
    )
}

export default SongItem
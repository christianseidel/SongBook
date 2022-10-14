import './styles/landingPage.css'
import {Song} from './models'

interface SongItemProps {
    song: Song
    onItemMarked: (id: string) => void;
}

function SongItemInList(props: SongItemProps) {

    const chooseSong = () => props.onItemMarked(props.song.id);

    return (
        <div>
            <div id={props.song.id} className={'songItem'} onClick={chooseSong}>
                &#129174; {props.song.title}
            </div>
        </div>
    )
}

export default SongItemInList
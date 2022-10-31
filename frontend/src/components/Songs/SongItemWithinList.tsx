import '../styles/landingPage.css'
import {Song} from './songModels'

interface SongItemProps {
    song: Song
    openItemClicked: (id: string) => void;
}

function SongItemWithinList(props: SongItemProps) {

    const chooseSong = () => props.openItemClicked(props.song.id);

    return (
        <div>
            <div id={props.song.id} className={'songItem'} onClick={chooseSong}>
                &#129174; {props.song.title}
            </div>
        </div>
    )
}

export default SongItemWithinList
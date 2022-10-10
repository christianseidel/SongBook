import {Reference} from "./ReferenceModels";
import '../styles/references.css';
import '../styles/common.css';

interface ReferenceItemProps {
    reference: Reference
    onItemClick: (id: string) => void;
}

function ReferenceItem(props: ReferenceItemProps) {


    return (
        <div>
            <div id={props.reference.id} className={'referenceItem'}
                 onClick={() => {props.onItemClick(props.reference.id)}}>
                {props.reference.title}
                <span className={'referenceItemDetails'}>(
                    {props.reference.volume}
                    {(props.reference.page != '0')
                        && <span className={'referenceItemDetailsPage'}>,
                            p. {props.reference.page}</span>}
                    )
                </span>
            </div>
        </div>
    )
}

export default ReferenceItem
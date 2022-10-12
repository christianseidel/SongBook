import {Reference} from "./ReferenceModels";
import '../styles/references.css';
import '../styles/common.css';
import React from "react";

interface ReferenceItemProps {
    reference: Reference
    onItemClick: (id: string) => void;
}

function ReferenceItem(props: ReferenceItemProps) {

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        let itemDragged = document.getElementById(props.reference.id) as HTMLDivElement | null;
        if (itemDragged !== null) {
            itemDragged.style.cursor = 'grabbing';
        }

    }

    return (
        <div>
            <div id={props.reference.id} className={'referenceItem'}
                 onClick={() => {props.onItemClick(props.reference.id)}}
                 draggable={'true'} onDragStart={handleDragStart}>
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
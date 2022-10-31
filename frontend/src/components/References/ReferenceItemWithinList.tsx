import {songCollectionToRealName, Reference} from "./referenceModels";
import '../styles/references.css';
import '../styles/common.css';
import React from "react";

interface ReferenceItemProps {
    reference: Reference
    onItemClick: (id: string) => void;
}

function ReferenceItemWithinList(props: ReferenceItemProps) {

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        let itemDragged = document.getElementById(props.reference.id) as HTMLDivElement | null;
        if (itemDragged !== null) {
            itemDragged.style.cursor = 'grabbing';
        }
        event.dataTransfer.setData('text', event.currentTarget.id);
    }

    return (
        <div>
            <div id={props.reference.id} className={'referenceItem'}
                 onClick={() => {props.onItemClick(props.reference.id)}}
                 draggable={'true'} onDragStart={handleDragStart}>
                {props.reference.title}
                <span className={'referenceItemDetails'}>&ndash;&#129174;&nbsp;
                    {songCollectionToRealName(props.reference.songCollection)}
                    {(props.reference.page !== 0)
                        && <span className={'referenceItemDetailsPage'}>,
                            p. {props.reference.page}</span>}
                </span>
            </div>
        </div>
    )
}

export default ReferenceItemWithinList
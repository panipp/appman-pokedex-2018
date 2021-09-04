import React, { useEffect, useRef, useState } from 'react'
import happiness from '../cute.png'
import find from '../search.png'
import { DetailProgress } from "./detail-progress";

export const CardsModal = React.forwardRef((props, ref) => {
    const { isShow, cards } = props // Destructuring
    const [contents, setContents] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [hoverIndex, setHover] = useState(null);
    const [search, setSearch] = useState('');
    const myRef = useRef();

    const handleClickOutside = e => {
        if (!myRef.current?.contains(e.target)) {
            // Clear search value when close modal
            setSearch('');

            props.close();
        }
    };

    const addCard = card => {
        props.addCard(card);
        setContents(contents.filter(obj => obj.name !== card.name));

        // When click 'Add' last card hoverIndex will over cards length and will make add button error
        if (hoverIndex === cards.length - 1) {
            setHover(hoverIndex - 1);
        }
    }

    const searchCard = (search) => {
        if (!search) {
            setContents(cards);
        }
        const item = cards.filter(content => {
            return content.name.toLowerCase().includes(search.toLowerCase())
                || content.type.toLowerCase().includes(search.toLowerCase());
        });
        setContents(item);
    }

    useEffect(() => {
        setShowModal(isShow);
        setContents(cards);

        // Detect click outside modal
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShow])


    return (
        <>
            { showModal ? <div className="card-modal">
                <div className="card-content" ref={ myRef }>
                    <div className="position-relative">
                        <input type="text" className="form-control mb-2" placeholder="Find pokemon"
                            value={ search } onChange={ (e) => {
                            setSearch(e.target.value)
                            searchCard(e.target.value);
                        } }/>
                        <img className="position-absolute find-icon" src={ find } alt="find"/>
                    </div>
                    <div className="overflow-auto" style={{ height: '92%' }}>
                        { contents.map((card, index) => {
                            return <div className="card-detail position-relative m-2 p-2 pb-3 d-flex" key={ index }
                                onMouseEnter={ () => setHover(index) }
                                onMouseLeave={ () => setHover(null) }>
                                <img className="card-img" src={ card.imageUrl } alt="card"/>
                                <div className="mx-3 w-50">
                                    <div className="font-35">{ card.name }</div>
                                    <div className="row mb-1">
                                        <DetailProgress title="HP" progress={ card.hp }/>
                                    </div>
                                    <div className="row mb-1">
                                        <DetailProgress title="STR" progress={ card.strength }/>
                                    </div>
                                    <div className="row mb-3">
                                        <DetailProgress title="WEAK" progress={ card.weakness }/>
                                    </div>
                                    <div className="row mx-0">
                                        { [...Array(card.happiness)].map((smile, smileIndex) => {
                                            return <div className="col-auto px-0" key={ smileIndex }>
                                                <img className="happiness" src={ happiness } alt="happiness"/>
                                            </div>
                                        }) }
                                    </div>
                                </div>
                                { index === hoverIndex ? <div className="position-absolute add-card"
                                    onClick={() => addCard(card)}>ADD</div> : '' }
                            </div>
                        }) }
                    </div>
                </div>
            </div> : '' }
        </>
    )
});

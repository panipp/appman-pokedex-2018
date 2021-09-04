import React, { useEffect, useState } from 'react'
import './App.css'
import axios from "axios";
import { CardsModal } from "./components/cards-modal";
import happiness from './cute.png'
import { DetailProgress } from "./components/detail-progress";

const App = () => {
    const [contents, setContents] = useState(null);
    const [selectedCard, setSelectedCard] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [hoverIndex, setHover] = useState(null);

    const closeModal = () => {
        setShowModal(false);
    }

    function openModal() {
        setShowModal(true);
    }

    function addCardToList(card) {
        setSelectedCard([...selectedCard, card]);
        setContents(contents.filter(obj => obj.name !== card.name));
    }

    function remove(card) {
        setContents([...contents, card]);
        setSelectedCard(selectedCard.filter(obj => obj.name !== card.name));
    }

    useEffect(() => {
        const cards = [];
        axios.get('http://localhost:3030/api/cards').then(res => {
            const cardsList = res.data?.cards;
            for (let index in cardsList) {
                // Initial data
                let data = {
                    name: cardsList[index].name,
                    type: cardsList[index].type,
                    imageUrl: cardsList[index].imageUrl,
                    hp: null,
                    strength: null,
                    weakness: null,
                    damage: 0,
                    happiness: null
                };

                // Calculate HP
                if (Number(cardsList[index].hp) && Number(cardsList[index].hp) > 0) {
                    data.hp = Number(cardsList[index].hp) > 100 ? 100 : Number(cardsList[index].hp);
                } else {
                    data.hp = 0;
                }

                // Calculate Strength
                data.strength = cardsList[index].attacks?.length ? (cardsList[index].attacks?.length) * 50 : 0;

                // Calculate Weakness
                data.weakness = cardsList[index].weaknesses?.length ? (cardsList[index].weaknesses?.length) * 100 : 0;

                // Calculate Damage
                for (let damageIndex in cardsList[index].attacks) {
                    if (cardsList[index].attacks[damageIndex].damage) {
                        data.damage = data.damage + Number(cardsList[index].attacks[damageIndex].damage?.match(/\d+/)[0]);
                    }
                }
                // Calculate Happiness ** This formula use calculated data and round up when has decimal
                data.happiness = Math.ceil(((data.hp / 10) + (data.damage / 10) + 10 - (data.weakness / 100)) / 5)

                // Push card data to array
                cards.push(data)
            }
            setContents(cards)
        })
    }, [])

    return <div className="App">
        { contents ?
            <CardsModal isShow={ showModal }
                cards={ contents }
                addCard={ c => addCardToList(c) }
                close={ closeModal }/> : '' }
        <header>
            <span>My Pokedex</span>
        </header>
        <div className="content">
            { selectedCard.map((card, index) => {
                return <div className="selected-card-detail position-relative m-2 p-2 pb-3 d-flex" key={ index }
                    onMouseEnter={ () => setHover(index) }
                    onMouseLeave={ () => setHover(null) }>
                    <img className="card-img" src={ card.imageUrl } alt="card"/>
                    <div className="mx-3 w-75">
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
                        {/* It will expand the height of card when happiness over 5 */}
                        <div className="row mx-0">
                            { [...Array(card.happiness)].map((smile, smileIndex) => {
                                return <div className="col-auto px-0" key={ smileIndex }>
                                    <img className="happiness" src={ happiness } alt="happiness"/>
                                </div>
                            }) }
                        </div>
                    </div>
                    { index === hoverIndex ?
                        <div className="position-absolute add-card" onClick={() => remove(card)}>X</div> : '' }
                </div>
            }) }
        </div>
        <footer>
            <button type="button" className="btn-circle" onClick={() => openModal()}>
                +
            </button>
        </footer>
    </div>
}

export default App;

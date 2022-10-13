import {useContext} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

export default function Card({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `element__trash-btn ${isOwn ? 'element__trash-btn_visible' : 'element__trash-btn_hidden'}`
  );

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(i => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `element__like-btn ${isLiked && 'element__like-btn_active'}`
  );

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="element">
      <img className="element__image" src={card.link} alt={card.name} onClick={handleClick} />
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <div className="element__caption">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__like-container">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <div className="element__like-counter">{card.likes.length}</div>
        </div>
      </div>
    </li>
  );
}

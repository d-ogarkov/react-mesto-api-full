export default function ImagePopup({card, onClose}) {
  return (
    <div className={`popup popup_type_image-view ${card && 'popup_opened'}`}>
      <div className="popup__media">
        <button type="button" className="popup__close-btn" onClick={onClose}></button>
        <img className="popup__image" src={card && card.link} alt="Просмотр изображения" />
        <p className="popup__caption"></p>
      </div>
    </div>
  );
}

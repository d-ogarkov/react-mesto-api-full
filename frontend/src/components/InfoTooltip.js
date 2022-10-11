export default function InfoTooltip({stateOk, message, isOpen, onClose}) {
  return (
    <div className={`popup ${isOpen && 'popup_opened'}`}>
    <div className="popup__container popup__container_type_info">
      <button type="button" className="popup__close-btn" onClick={onClose}></button>
        <div className={`infotooltip__icon_type_${stateOk ? 'ok' : 'error'}`}></div>
        <h2 className="popup__title">{message}</h2>
    </div>
    </div>
  );
}

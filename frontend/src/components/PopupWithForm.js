export default function PopupWithForm({name, title, buttonText, isOpen, onClose, onSubmit, children}) {
  return (
    <div className={`popup popup_type_${name} ${isOpen && 'popup_opened'}`}>
    <div className="popup__container">
      <form action="/" method="post" onSubmit={onSubmit} name={name} className={`form ${name}`}>
        <button type="button" className="popup__close-btn" onClick={onClose}></button>
        <h2 className="popup__title">{title}</h2>
        {children}
        <input type="submit" className="popup__submit-btn" value={buttonText} />
      </form>
    </div>
    </div>
  );
}

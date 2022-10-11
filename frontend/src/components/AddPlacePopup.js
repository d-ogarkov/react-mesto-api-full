import {useEffect, useState} from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setTitle('');
    setLink('');
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
  
    onAddPlace({
      name: title,
      link
    });
  }

  return (
    <PopupWithForm name="add-form" title="Новое место" buttonText="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
        <fieldset className="popup__fieldset">
        <label className="popup__field">
            <input type="text" value={title || ''} onChange={e => setTitle(e.target.value)} id="title-input" name="title" className="popup__input popup__input_type_title" placeholder="Название" required minLength="2" maxLength="30" />
            <span className="popup__error title-input-error"></span>
        </label>
        <label className="popup__field">
            <input type="url" value={link || ''} onChange={e => setLink(e.target.value)} id="link-input" name="link" className="popup__input popup__input_type_link" placeholder="Ссылка на картинку" required />
            <span className="popup__error link-input-error"></span>
        </label>
        </fieldset>
    </PopupWithForm>
  );
}
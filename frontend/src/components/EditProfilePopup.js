import {useContext, useEffect, useState} from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

export default function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm name="edit-form" title="Редактировать профиль" buttonText="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <fieldset className="popup__fieldset">
        <label className="popup__field">
          <input type="text" value={name || ''} onChange={e => setName(e.target.value)} id="name-input" name="name" className="popup__input popup__input_type_name" placeholder="Имя" required minLength="2" maxLength="40" />
          <span className="popup__error name-input-error"></span>
        </label>
        <label className="popup__field">
          <input type="text" value={description || ''} onChange={e => setDescription(e.target.value)} id="about-input" name="about" className="popup__input popup__input_type_about" placeholder="Титул" required minLength="2" maxLength="200" />
          <span className="popup__error about-input-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

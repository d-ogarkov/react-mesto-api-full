import {useEffect, useRef} from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatarRef = useRef();

  useEffect(() => {
    avatarRef.current.value = '';
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm name="avatar-form" title="Обновить аватар" buttonText="Сохранить" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <fieldset className="popup__fieldset">
        <label className="popup__field">
          <input type="url" ref={avatarRef} id="avatar-input" name="avatar" className="popup__input popup__input_type_link" placeholder="Ссылка на картинку" required />
          <span className="popup__error avatar-input-error"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
}

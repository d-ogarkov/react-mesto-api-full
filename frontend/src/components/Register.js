import {useState} from 'react';

export default function Register({handleRegister}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // Если какие-то данные не введены, то сообщаем об ошибке и возвращаемся
    if (!email || !password) {
      return;
    }
    setEmail('');
    setPassword('');
    handleRegister(email, password);
  }

  return (
    <main className="content">
      <div className="popup__container popup__container_type_auth">
        <form action="/" method="post" onSubmit={handleSubmit} className={`form`}>
        <h2 className="popup__title popup__title_type_auth">Регистрация</h2>
          <fieldset className="popup__fieldset">
            <label className="popup__field">
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} id="email-input" name="email" className="popup__input popup__input_type_auth" placeholder="Email" required />
            </label>
            <label className="popup__field">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} id="password-input" name="password" className="popup__input popup__input_type_auth" placeholder="Пароль" required />
            </label>
          </fieldset>
          <input type="submit" className="popup__submit-btn popup__submit-btn_type_auth" value="Зарегистрироваться" />
          <p>Уже зарегистрированы? <a className="popup__link popup__link_type_auth" href="/sign-in">Войти</a></p>
        </form>
      </div>
    </main>
  );
}

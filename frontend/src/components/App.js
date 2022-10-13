import {useEffect, useState} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';
import {api} from '../utils/api';
import Header from './Header';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from "./ImagePopup";
import InfoTooltip from './InfoTooltip';
import Footer from './Footer';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState([]);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [infoStateOk, setInfoStateOk] = useState(false); // Для отображения статуса в InfoTooltip: ОК или ошибка
  const [infoMessage, setInfoMessage] = useState(false); // Для отображения сообщения в InfoTooltip
  const [email, setEmail] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен пользователя
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      tokenCheck(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
    .then(newCard => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    })
    .catch((err) => console.log(err));
  }

  function handleUpdateUser(newUserInfo) {
    api.setUserInfo(newUserInfo)
    .then((res) => {
      if (res) {
        setCurrentUser(res);
        closeAllPopups();
      }
    })
    .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(newAvatar) {
    api.setAvatar(newAvatar)
    .then((res) => {
      if (res) {
        setCurrentUser(res);
        closeAllPopups();
      }
    })
    .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newPlace) {
    api.addCard(newPlace)
    .then((res) => {
      if (res) {
        setCards([res, ...cards]);
        closeAllPopups();
      }
    })
    .catch((err) => console.log(err));
  }

  // Регистрируем пользователя
  function handleRegister(email, password) {
    api.register(email, password)
    .then((res) => {
      if (res) {
        openInfoTooltip(true, 'Вы успешно зарегистрировались!');
      }
    })
    .catch(err => {
      console.log(err);
      openInfoTooltip(false, 'Что-то пошло не так! Попробуйте ещё раз.');
    });
  }

  // Авторизуем пользователя, проверяем токен и редиректим на главную
  function handleLogin(email, password) {
    api.authorize(email, password)
    .then((res) => {
      if (res.token) {
        // Проверим токен, чтобы загрузить email пользователя после логина
        tokenCheck(res.token);
        history.push('/');
      }
    })
    .catch(err => {
      console.log(err);
      openInfoTooltip(false, 'Что-то пошло не так! Попробуйте ещё раз.'); // false = не ОК
    });
  }

  function openInfoTooltip(state, message) {
    setInfoStateOk(state);
    setInfoMessage(message);
    setIsInfoTooltipOpen(true);
  }

  // Загружаем информацию о пользователе и карточки
  function loadUserData() {
    api.getUserInfo()
      .then(resUserInfo => {
        setCurrentUser(resUserInfo);
      })
      .catch((err) => console.log(err));
    api.getInitialCards()
      .then(resInitialCards => {
        setCards(resInitialCards);
      })
      .catch((err) => console.log(err));
  }

  // Проверяет, действующий токен или нет
  function tokenCheck(jwt) {
    if (jwt) {
      api.getContent(jwt).then((res) => {
        if (res) {
          // Авторизуем пользователя
          setLoggedIn(true);
          // Сохраним нужные данные
          //setEmail(res.data.email);
          setEmail(res.email);
          // Загрузим информацию для главной страницы
          loadUserData();
          // Перенаправим на главную
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} />
        <Switch>
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <ProtectedRoute
            path="/"
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn}
            component={Main}
          />
        </Switch>
        <Footer />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <PopupWithForm name="delete-form" title="Вы уверены?" buttonText="Да" onClose={closeAllPopups} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <InfoTooltip stateOk={infoStateOk} message={infoMessage} isOpen={isInfoTooltipOpen} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

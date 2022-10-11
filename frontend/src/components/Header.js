import logo from '../images/header-logo.svg';
import {Link, Route, Switch, useHistory} from 'react-router-dom';

export default function Header({email}) {
  const history = useHistory();

  function onSignOut() {
    localStorage.removeItem('token');
    history.push('/sign-in');
  }
  
  return (
    <header className="header">
      <a className="link" href="/"><img className="header__logo" src={logo} alt="Mesto Russia" lang="en" /></a>
      <ul className="header__links">
        <Switch>
          <Route exact path="/">
            <li><Link to="#" className="header__link">{email}</Link></li>
            <li><Link to="#" onClick={onSignOut} className="header__link header__link_type_aux">Выйти</Link></li>
          </Route>
          <Route path="/sign-in">
            <li><Link to="/sign-up" className="header__link">Регистрация</Link></li>
          </Route>
          <Route path="/sign-up">
            <li><Link to="/sign-in" className="header__link">Войти</Link></li>
          </Route>
        </Switch>
      </ul>
    </header>
  );
}

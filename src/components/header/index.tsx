import style from './header.module.css';
import logoimg from '../../assets/logo.svg';
import { Link } from 'react-router-dom';


export function Header(){

    return(
        <div>
            <header className={style.container}>
                <Link to={'/'}><img src={logoimg} alt="logo Cripto Web" /></Link>
            </header>
        </div>
    );
}
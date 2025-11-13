import { redirect } from 'next/navigation';
import {getSession} from '../../lib/auth-utils';

export default async function Home() {
    const sesion = await getSession();

    if (sesion?.user) {
        //Si el usuario esta logueado
        redirect('/dashboard');
    }else{
        //Redirigir a la página de login
        redirect('/login');
    }
}
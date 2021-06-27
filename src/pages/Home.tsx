import { useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
//import { useForm } from 'react-hook-form';
//import { yupResolver } from '@hookform/resolvers/yup';
//import * as Yup from 'yup';

import '../styles/auth.scss';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

/*const schema = Yup.object().shape({
  roomCode: Yup.string().required('Código obrigatório').min(6, '6 Caracteres no mínimo')
})*/

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const { theme, toggleTheme } = useTheme();

  /*const { register, handleSubmit, formState } = useForm ({
    resolver: yupResolver(schema)
  });*/

  async function handleCreateRoom(){
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === ''){
      return;
    }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    
    if (!roomRef.exists()){
      alert('Sala não existe.');
      return;
    }
    if (roomRef.val().endedAt){
      alert('Sala já encerrada.');
      return;
    }
    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <button onClick={toggleTheme}>Mudar Tema</button>
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={/*handleSubmit(*/handleJoinRoom/*)*/}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
              //{...register('roomCode')}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
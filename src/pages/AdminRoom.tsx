import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode'; 
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
//import { database } from '../services/firebase';
import '../styles/room.scss';
import deleteImg from '../assets/images/delete.svg';
import { database } from '../services/firebase';
import Modal from 'react-modal';
import { useState, Fragment } from 'react';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  //const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();
  
  /*useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, [user, history]);*/

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    });

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });

  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });

  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>
        
        <div className="question-list">
          {questions.map(question => {
            return (
              <Fragment key="question.id">
              <Question
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                <>
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>
                <button
                  className="highlight-button"
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                </>)}
                <button
                  type="button"
                  onClick={() => setQuestionIdModalOpen(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
              <Modal 
                isOpen={questionIdModalOpen === question.id}
                onRequestClose={() => setQuestionIdModalOpen(undefined)}
              >
                <button onClick={() => handleDeleteQuestion(question.id)}>Deletar</button>
                <button onClick={() => setQuestionIdModalOpen(undefined)}>Fechar</button>
            </Modal>
            </Fragment>
            );
          })}
        </div>
      </main>
    </div> 
  );
}
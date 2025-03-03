import './app.less'
import React, { useState, useEffect } from 'react'
import Board from 'react-trello'
import URI from 'urijs';
import { RequestServerService } from '../../../basic/services/requestServerService';
import CardModal from './cardModal';


const parseUrlBoardId = () => (new URI(document.location.href)).segment(2);

const requestService = new RequestServerService();
const App = () => {
  const [appInitialized, setAppInitialized] = useState(false);
  const [boardConfig, setBoardConfig] = useState(null);
  const [boardData, setBoardData] = useState({ lanes: [] });
  const [eventBus, setEventBus] = useState(null);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalObject, setCardModalObject] = useState(null);
  
  const getBoardConfig = () => {
    requestService.get(`/boards/${parseUrlBoardId()}`).then(({ board }) => {
      setBoardConfig(board);
    });
  };
  const refreshBoardData = () => {
    requestService.get(`/boards/${parseUrlBoardId()}/data`).then(({ data }) => {
      setBoardData(data);
    });
  };
  
  useEffect(async () => {
    if (!appInitialized) {
      await refreshBoardData();
      setAppInitialized(true);
    }
  }, []);
  
  const handleDragEnd = async (cardId, sourceLaneId, targetLaneId, newPosition) => {
    try {
      requestService.patch(`/tasks/${cardId}/move`, {
        columnId: parseInt(targetLaneId, 10),
        position: newPosition,
      }).then(() => {
        refreshBoardData();
      });
    } catch (error) {
      console.error("❌ Failed to move task:", error);
    }
  };
  
  const handleCardAdd = async (card, laneId) => {
    console.log(`New card added to lane ${laneId}`);
    console.dir(card);
    
    const token = localStorage.getItem('jwt_token');
    
    const newTask = {
      type: card.type || "default",
      title: card.title || "Untitled",
      description: card.description || "No description",
      link: card.link || "No link",
      estimation: card.estimation || "No estimation",
      columnId: Number(laneId),
    };
    
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }
      
      console.log('✅ Task created successfully!');
    } catch (error) {
      console.error('❌ Failed to create task:', error.message);
      alert(`Error: ${error.message}`);
    }
  };
  
  const handleCardDelete = async (cardId, laneId) => {
    console.log(`New card deleted from lane ${laneId}`);
    
    const token = localStorage.getItem('jwt_token');
    
    try {
      const response = await fetch(`http://localhost:3000/tasks/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
      }
      
      console.log('✅ Task deleted successfully!');
    } catch (error) {
      console.error('❌ Failed to delete task:', error.message);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="App">
      <div className="App-header">
        <h3>React Trello Demo</h3>
      </div>
      <div className="App-intro">
        <Board
          // editable
          // onCardAdd={handleCardAdd}
          // onCardDelete={handleCardDelete}
          // draggable
          // eventBusHandle={setEventBus}
          // handleDragEnd={handleDragEnd}
          
          data={boardData}
          onCardClick={(cardId, metadata, laneId) => {
            let lane = boardData.lanes.filter(({ id: lId }) => lId === laneId);
            lane = lane[0];
            const card = lane.cards.filter(({ id: cId }) => cId === cardId);
  
            setCardModalObject(card[0]);
            setTimeout(() => {
              setIsCardModalOpen(true);
            }, 0);
          }}
          components={{
            AddCardLink: () => (
              <button
                type="submit"
                onClick={() => {
                  setCardModalObject(null);
                  setIsCardModalOpen(true);
                }}
              >Add</button>
            )
          }}
        />
      </div>
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => {
          setCardModalObject(null);
          setIsCardModalOpen(false);
        }}
        card={cardModalObject}
      />
    </div>
  )
};

export default App

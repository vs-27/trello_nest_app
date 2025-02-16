import './app.less'
import React, { useState, useEffect } from 'react'
import Board from 'react-trello'
import URI from 'urijs';
import { RequestServerService } from '../../../basic/services/requestServerService';

const data = require('./data.json');

const parseUrlBoardId = () => (new URI(document.location.href)).segment(2);

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log('drag ended');
  console.log(`cardId: ${cardId}`);
  console.log(`sourceLaneId: ${sourceLaneId}`);
  console.log(`targetLaneId: ${targetLaneId}`)
};

const requestService = new RequestServerService();
const App = () => {
  const [appInitialized, setAppInitialized] = useState(false);
  const [boardConfig, setBoardConfig] = useState(null);

  const [boardData, setBoardData] = useState({ lanes: [] });
  const [eventBus, setEventBus] = useState(null);
  
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
      setAppInitialized(true);
  
      await getBoardConfig();
      await refreshBoardData();
    }
  }, []);
  
  const getBoard = () => {
    return new Promise((resolve) => {
      resolve(data)
    })
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
  
  return (
    <div className="App">
      <div className="App-header">
        <h3>React Trello Demo</h3>
      </div>
      <div className="App-intro">
        <Board
          editable
          onCardAdd={handleCardAdd}
          data={boardData}
          draggable
          eventBusHandle={setEventBus}
          handleDragEnd={handleDragEnd}
        />
      </div>
    </div>
  )
};

export default App

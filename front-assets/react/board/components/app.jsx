import './app.less'
import React, { useState, useEffect } from 'react'
import Board from 'react-trello'

const data = require('./data.json')

// Handle drag start and end
const handleDragStart = (cardId, laneId) => {
  console.log('drag started')
  console.log(`cardId: ${cardId}`)
  console.log(`laneId: ${laneId}`)
}

const handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
  console.log('drag ended')
  console.log(`cardId: ${cardId}`)
  console.log(`sourceLaneId: ${sourceLaneId}`)
  console.log(`targetLaneId: ${targetLaneId}`)
}

// Functional component for App
const App = () => {
  // State hook for board data and event bus
  const [boardData, setBoardData] = useState({ lanes: [] })
  const [eventBus, setEventBus] = useState(null)
  
  // Fetch the board data on mount
  useEffect(() => {
    const fetchBoardData = async () => {
      const response = await getBoard()
      setBoardData(response)
    }
    fetchBoardData()
  }, [])
  
  // Get board data (mocked with a resolved promise)
  const getBoard = () => {
    return new Promise((resolve) => {
      resolve(data)
    })
  }
  
  // Complete the 'Buy Milk' card
  const completeCard = () => {
    if (eventBus) {
      eventBus.publish({
        type: 'ADD_CARD',
        laneId: 'COMPLETED',
        card: {
          id: 'Milk',
          title: 'Buy Milk',
          label: '15 mins',
          description: 'Use Headspace app',
        },
      })
      eventBus.publish({
        type: 'REMOVE_CARD',
        laneId: 'PLANNED',
        cardId: 'Milk',
      })
    }
  }
  
  // Add a new card to the blocked lane
  const addCard = () => {
    if (eventBus) {
      eventBus.publish({
        type: 'ADD_CARD',
        laneId: 'BLOCKED',
        card: {
          id: 'Ec2Error',
          title: 'EC2 Instance Down',
          label: '30 mins',
          description: 'Main EC2 instance down',
        },
      })
    }
  }
  
  // Handle new data received
  const shouldReceiveNewData = (nextData) => {
    console.log('New card has been added')
    console.log(nextData)
  }
  
  // Handle card addition to a lane
  const handleCardAdd = (card, laneId) => {
    console.log(`New card added to lane ${laneId}`)
    console.dir(card)
  }
  
  return (
    <div className="App">
      <div className="App-header">
        <h3>React Trello Demo</h3>
      </div>
      <div className="App-intro">
        <button onClick={completeCard} style={{ margin: 5 }}>
          Complete Buy Milk
        </button>
        <button onClick={addCard} style={{ margin: 5 }}>
          Add Blocked
        </button>
        <Board
          editable
          onCardAdd={handleCardAdd}
          data={boardData}
          draggable
          onDataChange={shouldReceiveNewData}
          eventBusHandle={setEventBus}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
        />
      </div>
    </div>
  )
}

export default App

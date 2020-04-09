import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialState = [
  {
    title: "План на месяц",
    cards: [
      "Пройти курс по React",
      "Отметить день рождения",
      "Записаться на курсы английского языка, чтобы уехать жить в Лондон",
      "Пройти курс по React",
      "Отметить день рождения",
      "Записаться на курсы английского языка, чтобы уехать жить в Лондон",
      "Пройти курс по React",
      "Отметить день рождения",
      "Записаться на курсы английского языка, чтобы уехать жить в Лондон",
    ]
  },
  {
    title: "План на день",
    cards: [
      "Записаться на курс по React",
      "Забронировать тир на субботу",
      "Накидать тем для статей в блог",
      "Сделать колонку Итоги"
    ]
  },
  {
    title: "Сходить в магазин",
    cards: [
      "Записаться на курс по React",
      "Забронировать тир на субботу",
      "Накидать тем для статей в блог",
      "Сделать колонку Итоги"
    ]
  }
];

const itemsFromBackend = [
  {
    id: '1',
    content: 'First task'
  },
  {
    id: '2',
    content: 'Second Task'
  },
  {
    id: '3',
    content: 'Second Task'
  },
  {
    id: '4',
    content: 'Second Task'
  },
  {
    id: '5',
    content: 'Second Task'
  }
]


const columnsFromBackend =
{
  1: {
    name: 'Todo',
    items: itemsFromBackend
  },
  2: {
    name: 'InProgress',
    items: []
  },
  3: {
    name: 'InProgress',
    items: []
  },
  4: {
    name: 'InProgress',
    items: []
  }
}

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;

  const copiedItems = [...columns];


  const { source, destination } = result;
  const { index: sourceCardIndex, droppableId: sourcePanelId } = source;
  const { index: destinationCardIndex, droppableId: destinationPanelId } = destination;

  const sourceColumnIndex = parseInt(sourcePanelId.replace("panel-", ""));
  const destinationColumnIndex = parseInt(destinationPanelId.replace("panel-", ""));

  copiedItems.map((item, currentIndex) => {
    if (destinationColumnIndex === currentIndex) {
      const [sourceCard] = copiedItems[sourceColumnIndex].cards.splice(sourceCardIndex, 1 );
      const destinationCards = Array.from(copiedItems[destinationColumnIndex].cards);
      destinationCards.splice(destinationCardIndex, 0, sourceCard);
      item.cards = destinationCards;
    }
  })

  setColumns(copiedItems);


};


function App() {

  const [columns, setColumns] = useState(initialState);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="mainblock">
          <DragDropContext onDragEnd={ result => onDragEnd(result, columns, setColumns)} >
            {
              columns.map((column, panelIndex) => {
                console.log(column, panelIndex)
                return (
                  <div className="content" key={panelIndex}>
                    <h2 className="content__title">{column.title}</h2>
                    <div style={{ margin: 8 }} className="content__column">
                      <Droppable key={panelIndex} droppableId={`panel-${panelIndex}`}>
                        {
                          (provided, snapshot) => {
                            return (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  background: snapshot.isDraggingOver
                                    ? "lightblue"
                                    : "lightgrey",
                                  padding: 4,
                                  width: 250,
                                  minHeight: 500
                                }}
                              >
                                {
                                  column.cards.map((card, cardIndex) => {
                                    return (
                                      <Draggable key={cardIndex} draggableId={`card-${cardIndex}-${panelIndex}`} index={cardIndex}>
                                        {
                                          (provided, snapshot) => {
                                            return (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  userSelect: "none",
                                                  padding: 16,
                                                  margin: "0 0 8px 0",
                                                  minHeight: "50px",
                                                  backgroundColor: snapshot.isDragging
                                                    ? "#263B4A"
                                                    : "#456C86",
                                                  color: "white",
                                                  ...provided.draggableProps.style
                                                }}
                                              >
                                                {card}
                                              </div>
                                            )
                                          }
                                        }
                                      </Draggable>
                                    )
                                  })
                                }
                                {provided.placeholder}
                              </div>
                            )
                          }
                        }
                      </Droppable>
                    </div>

                  </div>
                )
              })
            }
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;

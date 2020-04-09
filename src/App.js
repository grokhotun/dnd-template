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

  // Копируем входящий массив данных
  const copiedItems = [...columns];

  // Вытаскиваем объекты source и destination из result
  const { source, destination } = result;
  // Запихиваем в переменные необходимые данные (index захваченной карты, index колонки в котором карту захватили)
  const { index: sourceCardIndex, droppableId: sourcePanelId } = source;
  const { index: destinationCardIndex, droppableId: destinationPanelId } = destination;

  //Убираем лишние символы, парсим в integer
  const sourceColumnIndex = parseInt(sourcePanelId.replace("panel-", ""));
  const destinationColumnIndex = parseInt(destinationPanelId.replace("panel-", ""));

  // Мапим массив данных
  copiedItems.map((item, currentIndex) => {
    // Если индекс объекта совпал с индекстом куда бросаем карту, то
    if (destinationColumnIndex === currentIndex) {
      // удаляем нужную карту из массива в переменную
      const [sourceCard] = copiedItems[sourceColumnIndex].cards.splice(sourceCardIndex, 1 );
      // копируем тот массив, куда будем дропать карту
      const destinationCards = Array.from(copiedItems[destinationColumnIndex].cards);
      // вставляем карту в нужную колонку
      destinationCards.splice(destinationCardIndex, 0, sourceCard);
      // присваиваем новый массив с добавленный карточкой в текущей МАПающийся
      item.cards = destinationCards;
    }
  })

  // Обновляем state
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

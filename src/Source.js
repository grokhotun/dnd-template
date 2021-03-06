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
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};


function App() {

  const [columns, setColumns] = useState(columnsFromBackend);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="mainblock">
          <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)} >
            {
              Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <div key={columnId}>
                    <h2>{column.name}</h2>
                    <div style={{ margin: 8 }}>
                      <Droppable droppableId={columnId} key={index}>
                        {(provided, snapshot) => {
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
                              {column.items.map((item, index) => {
                                return (
                                  <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => {
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
                                          {item.content}
                                        </div>
                                      );
                                    }}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          );
                        }}
                      </Droppable>
                    </div>
                  </div>
                );
              })
            }
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;

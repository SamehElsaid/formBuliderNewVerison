import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export default function DndResizableExample() {
  const [items, setItems] = useState([
    { id: "1", content: "Item 1", width: 200 },
    { id: "2", content: "Item 2", width: 200 },
    { id: "3", content: "Item 3", width: 200 }
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setItems(newItems);
  };

  const handleResize = (index, newWidth) => {
    const newItems = [...items];
    newItems[index].width = newWidth;
    setItems(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{ margin: 10, ...provided.draggableProps.style }}
                  >
                    <ResizableBox
                      width={item.width}
                      height={50}
                      minConstraints={[100, 50]}
                      maxConstraints={[400, 50]}
                      axis="x"
                      onResizeStop={(e, { size }) => handleResize(index, size.width)}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#80d8ff",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.content}
                      </div>
                    </ResizableBox>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

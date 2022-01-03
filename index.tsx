import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import ReactDOM from "react-dom";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const app = document.getElementById("app");
const initial = {
  listA: Array.from({ length: 10 }, (v, k) => k).map((k) => ({
    id: `ida-${k}`,
    content: `Quote A${k}`,
  })),
  listB: Array.from({ length: 10 }, (v, k) => k).map((k) => ({
    id: `idb-${k}`,
    content: `Quote B${k}`,
  })),
};

const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const ColsWrapper = styled.div`
  display: flex;
`;

const QuoteList = styled.div`
  border: 1px solid black;
  padding: 10px;
`;
const QuoteItem = styled.div`
  border: 1px solid black;
  padding: 10px;
  width: 200px;
  align: center;
`;

function Quote({ quote, index }) {
  return (
    <Draggable draggableId={quote.id} index={index}>
      {(provided) => (
        <QuoteItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {quote.content}
        </QuoteItem>
      )}
    </Draggable>
  );
}

function QuoteApp() {
  const [state, setState] = useState({ quotes: initial });

  function onDragEnd(result) {
    const { source, destination } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }
    const quotes = {
      listA: state.quotes.listA.slice(),
      listB: state.quotes.listB.slice(),
    };
    const [item] = quotes[source.droppableId].splice(source.index, 1);
    quotes[destination.droppableId].splice(destination.index, 0, item);
    setState({ quotes });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ColsWrapper>
        <div>
          <Droppable droppableId="listAOuter" isDropDisabled={false}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Droppable droppableId="listA" isDropDisabled={true}>
                  {(provided) => (
                    <QuoteList
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {state.quotes.listA.map((quote, index: number) => (
                        <Quote quote={quote} index={index} key={quote.id} />
                      ))}
                      {provided.placeholder}
                    </QuoteList>
                  )}
                </Droppable>
              </div>
            )}
          </Droppable>
        </div>
        <Droppable droppableId="listB" isDropDisabled={false}>
          {(provided) => (
            <QuoteList ref={provided.innerRef} {...provided.droppableProps}>
              {state.quotes.listB.map((quote, index: number) => (
                <Quote quote={quote} index={index} key={quote.id} />
              ))}
              {provided.placeholder}
            </QuoteList>
          )}
        </Droppable>
      </ColsWrapper>
    </DragDropContext>
  );
}

ReactDOM.render(<QuoteApp />, app);

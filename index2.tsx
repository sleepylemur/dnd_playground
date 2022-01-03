import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import ReactDOM from "react-dom";
import React, { FC } from "react";
import styled from "styled-components";
import { useDrag, useDrop, DndProvider } from "react-dnd";

import { HTML5Backend } from "react-dnd-html5-backend";

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

const ColsWrapper = styled.div`
  display: flex;
`;

const QuoteList = styled.div`
  border: 1px solid black;
  padding: 10px;
`;
const Card = styled.div`
  border: 1px solid black;
  padding: 10px;
  width: 200px;
  align: center;
`;

const CardWrapper: FC = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Card ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      a
    </Card>
  );
};

const Column: FC = () => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop} style={{ backgroundColor: isOver ? "red" : "pink" }}>
      {canDrop ? "release to drop" : "drag a box here"}
    </div>
  );
};

function QuoteApp() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CardWrapper />
      <CardWrapper />
      <CardWrapper />
      <Column />
    </DndProvider>
  );
}

export class Store {
  pageNumber = 0;

  pages = [];
  values = {};
  touched = {};
  errors = {};
  constructor() {
    makeAutoObservable(this);
  }
}

type AppProps = {
  formData: FormData;
};
const App = observer<AppProps>(({ store }) => {
  return <div>yo</div>;
});

const store = new Store();

ReactDOM.render(<QuoteApp />, app);

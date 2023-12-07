/* eslint-disable react/prop-types */
import { useState } from "react"
import "./App.css"
import { useDrag, useDrop } from "react-dnd"

const ITEMS = {
  BOX: "box",
}

function useStore() {
  const [left, setLeft] = useState([1, 2, 3, 4])
  const [right, setRight] = useState([5, 6, 7, 8])
  const move = (value, from, to) => {
    if (from === to) {
      return
    }
    if (from === "left") {
      setLeft((left) => left.filter((item) => item !== value))
      setRight((right) => [...right, value])
    } else {
      setRight((right) => right.filter((item) => item !== value))
      setLeft((left) => [...left, value])
    }
  }
  return [left, right, move]
}

function Item({ value, place }) {
  const [{ isDragging }, dragRef, previewRef] = useDrag(() => ({
    type: ITEMS.BOX,
    item: {
      value,
      place,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  return (
    <div
      ref={previewRef}
      style={{
        width: 200,
        textAlign: "right",
        background: isDragging ? "lightgray" : "white",
      }}
    >
      <div
        ref={dragRef}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          padding: 10,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function List({ items, place, move }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ITEMS.BOX,
    drop: (item) => {
      move(item.value, item.place, place)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))
  return (
    <div
      ref={dropRef}
      style={{
        border: "1px solid black",
        outline: isOver ? "4px solid #479bfa" : "none",
      }}
    >
      {items.map((item) => (
        <Item key={item} value={item} place={place} />
      ))}
    </div>
  )
}

function App() {
  const [left, right, move] = useStore()

  return (
    <>
      <List items={left} place="left" move={move} />
      <List items={right} place="right" move={move} />
    </>
  )
}

export default App

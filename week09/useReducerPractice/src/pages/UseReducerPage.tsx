import { useState } from "react"

export default function UseReducerPage() {
  const [count, setCount] = useState(0);

  const handleIncrease=() => {
    setCount(count+1);
  }
  return (
  <div>
    <h1>{count}</h1>
    <button onClick={handleIncrease}>Increase</button>
  </div>
  )
}

import { useReducer, useState } from "react"

// 1. state 에 대한 interface
interface IState {
  counter:number;
  error:null;
}

// 2. reducer 에 대한 interface
interface IAction {
  type: 'INCREASE' | 'DECREASE' |'RESET_TO_ZERO';
  payload: number;
}

function reducer(state: IState, action: IAction) {
  const {type, payload}=action; // 구조분해할당
  console.log(action);
  console.log(state);

  switch(type) {
    case 'INCREASE': 
    return {
      ... state,
      counter:state.counter +payload,
    }
    case 'DECREASE' :
      return {
        ... state,
      counter:state.counter -payload,
      }
      case 'RESET_TO_ZERO' :
        return {
          ... state,
      counter:0,
        }
    default:
      return state;
  }
}
export default function UseReducerPage() {
  // 1. useState
  const [count, setCount] = useState(0);

  // 2. useReducer
  const [state,dispatch] = useReducer(reducer, {
    counter:0,
    error:null,
  } )

  const handleIncrease = () => {
    setCount(count + 1);
  }

  console.log(state);

  return (
    <>
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-3xl">useState 훅 사용</h2>
          <h2>{count}</h2>
          <button onClick={handleIncrease}>Increase</button>
        </div>
        <div>
          <h2 className="text-3xl">useReducer 훅 사용</h2>
          <h2>{state.counter}</h2>
          <button onClick={() => dispatch({type: "INCREASE", payload:3})}>Increase</button>
          <button onClick={() => dispatch({type: "DECREASE", payload:3})}>Decrease</button>
          <button onClick={() => dispatch({type: "RESET_TO_ZERO", payload:0})}>Reset</button>
        </div>
      </div>

    </>
  )
}

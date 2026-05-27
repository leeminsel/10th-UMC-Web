import { useReducer, useState, type ChangeEvent } from "react";

interface IState {
    department: string;
    error: string | null;
}

interface IAction {
    type: 'CHANGE_DEPARTMENT' | 'RESET';
    payload: string;
}

function reducer(state: IState, action: IAction) {
    const { type, payload } = action;

    switch (type) {
        case 'CHANGE_DEPARTMENT': {
            return {
                ...state,
                department:payload
            }
        }
        default:
            return state;
    }
}

export default function UseReducerCompany() {
    const [state, dispatch] = useReducer(reducer, {
        department: 'Software Developer',
        error: null,
    })

    const [department, setDepartment] = useState('');

    const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
        setDepartment(e.target.value);
    }
    return (
        <div>
            <h1>{state.department}</h1>
            {state.error && <p className="text-red-500 font-2xl">{state.error}</p>}

            <input className="w-[600px] border mt-10 p-4 rounded-md"
                placeholder="변경하시고 싶은 직무를 입력해주세요. 단 거부권 행사 가능"
                value={department}
                onChange={handleChangeDepartment} />
                <button onClick={() => 
                    dispatch({ type: 'CHANGE_DEPARTMENT', payload:department})
                }>직무 변경하기</button>
        </div>
    )
}

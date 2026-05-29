import { useDispatch, useSelector } from "../hooks/useCustomRedux"
import { clearCart } from "../slices/cartSlice";
import { closeModal } from "../slices/modalSlice";

export const Modal = () => {
    const isOpen=useSelector((state) => state.modal.isOpen)
    const dispatch=useDispatch();

    if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-md p-8  flex flex-col items-center  gap-6 shadow-xl w-80">
            <p className="text-lg font-semibold text-gray-800">정말 삭제하시겠습니까?</p>
            <div className="flex gap-8">
                 <button onClick={() => {
                dispatch(clearCart());
                dispatch(closeModal());
            }
             } 
             className="bg-gray-400 px-6 py-2 rounded-sm hover:bg-gray-500 cursor-pointer">확인</button>
            <button onClick={() => dispatch(closeModal())}
                className="bg-red-400 px-6 py-2 rounded-sm hover:bg-red-500 cursor-pointer">취소</button>
            </div>
           
        </div>
    </div>
  )
}

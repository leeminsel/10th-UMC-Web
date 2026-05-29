import { useCartInfo } from "../hooks/useCartStore";
import { useDispatch } from "../hooks/useCustomRedux";
import { openModal } from "../slices/modalSlice";

export const PriceBox = () => {
  const {total} = useCartInfo();
  const dispatch=useDispatch();

  const handleInitializeCart=() => {
    dispatch(openModal());
  }
  return (
    <div className="p-10 flex justify-between">
      
        <button onClick={handleInitializeCart} className="border p-4 rounded-md cursor-pointer">
          장바구니 초기화
        </button>
      
      <div>총 가격: {total}원</div>
    </div>
  )
}

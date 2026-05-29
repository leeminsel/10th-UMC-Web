import { CartItem } from "./CartItem"
import { useSelector } from "../hooks/useCustomRedux";

export const CartList = () => {
  const {cartItems, amount, total} = useSelector((state) => state.cart);
  

  
  return (
    <div className="flex flex-col items-center justify-center">
        <ul>{cartItems.map((item) => (
            <CartItem key={item.id} lp={item}></CartItem>
        ))}
        </ul>
    </div>
  )
}

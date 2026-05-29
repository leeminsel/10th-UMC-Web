import { CartItem } from "./CartItem"
import { useCartActions, useCartInfo } from "../hooks/useCartStore";

export const CartList = () => {
  const {cartItems} = useCartInfo();
  const {clearCart}  = useCartActions();

 const handleAllClearButton=()=> {
  clearCart();
 }
  
  

  
  return (
    <div className="flex flex-col items-center justify-center">
        <ul>{cartItems.map((item) => (
            <CartItem key={item.id} lp={item}></CartItem>
        ))}
        </ul>
    </div>
  )
}

import cartItems from "../constants/cartItems"
import { CartItem } from "./CartItem"

export const CartList = () => {
  return (
    <div className="flex flex-col items-center justify-center">
        <ul>{cartItems.map((item) => (
            <CartItem key={item.id} lp={item}></CartItem>
        ))}</ul>
    </div>
  )
}

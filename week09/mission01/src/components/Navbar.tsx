import { FaShoppingCart } from "react-icons/fa"

export const Navbar = () => {

    return (
        <div className='flex justify-between items-center p-4 bg-gray-800 text-white'>
            <h1 className="text-2xl font-semibold">MINSELL</h1>
            <div className="flex items-center space-x-2">
                <FaShoppingCart className="text-2xl"></FaShoppingCart>
                <span className="text-xl font-medium">12</span>
            </div>
        </div>

    )
}

import './App.css'
import {Navbar} from './components/Navbar'
import { CartList} from './components/CartList'
import store from './store/store'
import { Provider } from 'react-redux'
import { PriceBox } from './components/PriceBox'
import { Modal } from './components/Modal'

function App() {
  return (
    <>
    <Provider store={store}>
      <Navbar />
      <CartList/>
      <PriceBox />
      <Modal/>
    </Provider>
    </>
  )
}

export default App

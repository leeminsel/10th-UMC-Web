import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
// <Outlet/> -> 무슨역할?

const HomePage=() => {
    return <div>
        <Navbar/>
        <Outlet/>
    </div>
};

export default HomePage;
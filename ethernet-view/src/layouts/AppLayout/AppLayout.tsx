import { TestingPage } from "pages/TestingPage/TestingPage";
import { Outlet, createBrowserRouter } from "react-router-dom"

export const AppLayout = () => {

    return (
        <div>
            
            <Outlet />
        </div>
    )
}

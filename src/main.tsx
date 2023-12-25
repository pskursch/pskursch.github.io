import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from "@tanstack/react-router";
import router from "./router.tsx";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)

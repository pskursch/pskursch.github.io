import {Outlet, RootRoute, Route, Router} from "@tanstack/react-router";
import App from "./App.tsx";
import ScoreboardPage from "./scoreboard/ScoreboardPage.tsx";


export const rootRoute = new RootRoute({
    component: () => <Outlet/>
});

export const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <App/>
})

export const scoreboardPageRoute = new Route({
    getParentRoute: () => rootRoute,
    path: 'scoreboard'
});

export const scoreboardRoute = new Route({
    getParentRoute: () => scoreboardPageRoute,
    path: '$scoreboardId',
    component: () => <ScoreboardPage/>
})


export const routeTree = rootRoute.addChildren([
    indexRoute,
    scoreboardPageRoute.addChildren([scoreboardRoute])
]);

export const router = new Router({
    routeTree,
    // basepath: "app"
});

export default router;

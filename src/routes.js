import Home from "./components/Home";

var routes = [
    {
        path:'/home',
        name: "Home",
        component: Home
    },
    {
        path: "*",
        name: "Home",
        component: Home,
    }
]

export default routes;
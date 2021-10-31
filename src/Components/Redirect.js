import { Redirect } from "react-router";

export function RedirectPathToHome({ location }) {
    return <Redirect to={{ ...location, pathname: '/' }} />
}
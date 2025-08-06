import { redirect } from "react-router";
import { RouteConfig } from "~/config/routeConfig";

export function loader() {
  return redirect(RouteConfig.KALKULATOR);
}

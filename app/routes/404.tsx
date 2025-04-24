import { data } from "react-router";
import { NotFound } from "../features/feilhåndtering/404";

export const loader = () => {
  return data({}, { status: 404 });
};

export default function NotFoundRoute() {
  return <NotFound />;
}

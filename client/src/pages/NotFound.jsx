import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap page empty">
      <p className="eyebrow">404</p>
      <h1>This page is not on the shelf.</h1>
      <Link className="btn btn-fill" to="/">
        Back home
      </Link>
    </div>
  );
}

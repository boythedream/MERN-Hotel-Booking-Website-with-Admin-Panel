import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-lg mx-auto px-6 py-32 text-center">
    <div className="font-mono text-6xl text-brass-dark mb-4">NO. 404</div>
    <h1 className="font-display text-3xl font-medium mb-4">This room doesn't exist</h1>
    <p className="text-ink-900/60 mb-8">
      The page you're looking for has checked out. Let's find your way back.
    </p>
    <Link to="/" className="btn-primary">
      Back to the lobby
    </Link>
  </div>
);

export default NotFound;

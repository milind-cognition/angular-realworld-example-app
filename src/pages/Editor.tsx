import { useParams } from "react-router-dom";

export default function Editor() {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <h1>{slug ? "Edit Article" : "New Article"}</h1>
            <p>Editor form will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

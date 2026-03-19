import { useParams } from "react-router-dom";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>Article: {slug}</h1>
        </div>
      </div>
      <div className="container page">
        <p>Article content will be implemented here.</p>
      </div>
    </div>
  );
}

import { useState, useEffect, type KeyboardEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Articles } from "../../api/agent";
import { useAuth } from "../../context/AuthContext";
import { ListErrors } from "../../components/shared/ListErrors";
import type { Errors } from "../../types";

export function Editor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Articles.get(slug).then(({ article }) => {
      if (user && article.author.username !== user.username) {
        navigate("/");
        return;
      }
      setTitle(article.title);
      setDescription(article.description);
      setBody(article.body);
      setTagList(article.tagList);
    });
  }, [slug, user, navigate]);

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tagList.includes(tag)) {
        setTagList([...tagList, tag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors(null);
    try {
      const articleData = { title, description, body, tagList };
      const result = slug
        ? await Articles.update({ slug, ...articleData })
        : await Articles.create(articleData);
      navigate(`/article/${result.article.slug}`);
    } catch (err) {
      setErrors(err as Errors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={errors} />
            <form onSubmit={handleSubmit}>
              <fieldset disabled={submitting}>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <div className="tag-list">
                    {tagList.map((tag) => (
                      <span key={tag} className="tag-default tag-pill">
                        <i
                          className="ion-close-round"
                          onClick={() => handleRemoveTag(tag)}
                        />
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

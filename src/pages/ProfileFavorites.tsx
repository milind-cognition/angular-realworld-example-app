import { useOutletContext } from "react-router-dom";
import { ArticleList } from "../components/ArticleList";

export default function ProfileFavorites() {
  const { username } = useOutletContext<{ username: string }>();

  return (
    <ArticleList
      limit={10}
      config={{ type: "all", filters: { favorited: username } }}
    />
  );
}

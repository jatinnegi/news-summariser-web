"use client";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/reducers";
import { useSelector } from "react-redux";
import WithAuth from "@/hoc/WithAuth";

interface ArticleProps {
  _id: string;
  url: string;
  title: string;
  summary: string;
}

const DashboardPage = () => {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const { user } = useSelector((state: RootState) => state.user);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  useEffect(() => {
    async function getArticles() {
      try {
        const response = await fetch("/api/articles", { method: "GET" });
        const { articles } = await response.json();
        setArticles(articles);
      } catch (error) {
        console.error(error);
      }
    }

    function handleClick() {
      setShowDetail(false);
    }

    getArticles();

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div className="w-11/12 my-4 mx-auto max-w-6xl flex justify-end">
        {user && (
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
            className="relative"
          >
            <img
              src={user.picture}
              alt={user.name}
              className="h-8 w-8 rounded-full cursor-pointer"
              onClick={() => {
                setShowDetail(true);
              }}
            />
            {showDetail && (
              <ul className="cursor-pointer absolute bottom-[-320%] w-48 right-0 bg-gray-100 shadow-sm rounded-lg p-4">
                <li className="text-sm font-normal">Hello, Jatin Negi</li>
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                    className="bg-gray-200 py-2 w-full mt-2 text-xs rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="w-11/12 my-4 mx-auto max-w-6xl">
        <p className="text-2xl">News Summaries</p>
        <div className="my-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.map((article: ArticleProps) => (
            <div
              key={article._id}
              className="border-[1px] border-zinc-400 p-4 shadow-lg rounded-lg w-full"
            >
              <p className="text-lg w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {article.title}
              </p>
              <p className="text-sm my-2 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {article.summary}
              </p>
              <a
                href={article.url}
                target="_blank"
                className="inline-block bg-gray-200 mt-2 rounded-md py-2 px-4 text-xs font-medium"
              >
                View Article
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WithAuth(DashboardPage);

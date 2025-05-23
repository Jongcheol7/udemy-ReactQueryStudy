import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.py4e.com/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

/**
 * useInfiniteQuery 를 사용해
 * data(가져온 모든 데이터)
 * fetchNextPage(다음페이지 가져오는 함수)
 * hasNextPage(다음페이지가 있는지 여부)
 * getNextPageParam : 다음 페이지가 있다면 그 url을 알려줘. lastPage는 마지막으로 불러온 페이지고 거기서 next 갓을 꺼내 다음 페이지의 url로 사용
 */
export function InfiniteSpecies() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["sw-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });
  if (isLoading) {
    return <div className="loading">로딩중입니다...</div>;
  }
  if (isError) {
    return <div>에러 : {error.toString()}</div>;
  }

  // TODO: get data for InfiniteScroll via React Query
  return (
    <>
      {isFetching && <div className="loading">패칭중입니다...</div>}
      <InfiniteScroll
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((page) => {
          return page.results.map((species) => (
            <Species
              name={species.name}
              language={species.language}
              averageLifespan={species.average_lifespan}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}

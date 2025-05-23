import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.py4e.com/api/people/";
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
export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined;
    },
  });
  if (isLoading) {
    return <div className="loading">로딩중입니다...</div>;
  }
  if (isError) {
    return <div>Error : {error.toString()}</div>;
  }

  /**
   * 스크롤 끝에 도달하면 loadMore 가 실행된다.
   * 만약 isFetching 이 false 라면 데이터를 가져오는 상태가 아니라면 다음 페이지를 불러온다.
   * hasMore 는 다음페이지가 있는지 여부
   */
  return (
    <>
      {isFetching && <div className="loading">패칭중입니다...</div>}
      <InfiniteScroll
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}

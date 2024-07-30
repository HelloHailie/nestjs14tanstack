"use client";

import { useQuery, useIsFetching } from "@tanstack/react-query";

interface Todo {
  // userId: number;
  id: number;
  title: string;
  // completed: boolean;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export default function Home() {
  // 현재 fetching 중인 쿼리의 개수를 리턴하는 훅
  const isFetching = useIsFetching();
  const {
    data: todosData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos").then((res) =>
        res.json()
      ),
    // 사용하지 않는 데이터 줄임으로써 타입을 줄일 수 있음
    select: (todos) =>
      todos.map((todo) => ({ id: todo.id, title: todo.title })),
  });

  const { data: usersData } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      ),
    // 쿼리가 자동으로 재요청되지 않도록 설정. 아래 코드는  todosData가 존재할 때만 쿼리 요청을 한다는 의미
    enabled: !!todosData,
  });

  if (isLoading) {
    return (
      <main className='mt-4 flex min-h-screen flex-col items-center'>
        Loading... 😄
      </main>
    );
  }

  if (isError) {
    return (
      <main className='mt-4 flex min-h-screen flex-col items-center'>
        Error 🥲
      </main>
    );
  }

  return (
    <main className='mt-4 flex min-h-screen flex-col items-center'>
      <h1 className='text-3xl '>TODOS</h1>
      <div>
        {todosData?.slice(0, 5).map((todo: Todo) => (
          <div className='py-2' key={todo.id}>
            <h2>{" " + todo.title}</h2>
          </div>
        ))}
      </div>

      <h1 className='text-3xl mt-10'>USERS</h1>
      <div>
        {usersData?.map((user: User) => (
          <div className='py-2' key={user.id}>
            <h2>{" " + user.name}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

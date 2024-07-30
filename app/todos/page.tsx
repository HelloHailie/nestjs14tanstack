"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  // userId: number;
  id: number;
  title: string;
  // completed: boolean;
}

const Todos = () => {
  const queryClient = useQueryClient();
  const mutation: any = useMutation<any>({
    mutationFn: (newTodo) => {
      return axios.post("http://localhost:3001/todos", newTodo);
    },
    onMutate: (variables) => {
      console.log("onMutate");
    },
    onError: (error, variables, context) => {
      console.log("Error", error.message);
    },
    onSuccess: (data, variables, context) => {
      console.log("Success", data);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const {
    data: todosData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () =>
      fetch("http://localhost:3001/todos").then((res) => res.json()),
    // 사용하지 않는 데이터 줄임으로써 타입을 줄일 수 있음
    select: (todos) =>
      todos.map((todo: Todo) => ({ id: todo.id, title: todo.title })),
  });

  return (
    <div className='mt-4 flex min-h-screen flex-col items-center'>
      {mutation.isPending ? (
        "Adding todo..."
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: "Do Laundry" });
            }}
          >
            Create Todo
          </button>
        </>
      )}
      <h1 className='text-3xl '>TODOS</h1>
      <div>
        {todosData?.map((todo: Todo) => (
          <div className='py-2' key={todo.id}>
            <h2>{" " + todo.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todos;

import {
  children,
  createEffect,
  createMemo,
  createSignal,
  For,
  splitProps,
} from "solid-js";
import styles from "./App.module.css";

const formattedTodo = (todo) => {
  return createMemo(
    () => `${todo.title} - ${todo.finished ? "DONE" : "ACTIVE"}`
  );
};

const Todo = (props) => {
  const [editedTitle, setEditedTitle] = createSignal(props.todo.title);
  const [editMode, setEditMode] = createSignal(false);

  const [data, actions] = splitProps(props, ["todo"]);

  return (
    <div>
      {editMode() ? (
        <input
          value={editedTitle()}
          onInput={(e) => setEditedTitle(e.target.value)}
        />
      ) : (
        <p>{formattedTodo(data.todo)()}</p>
      )}

      {editMode() ? (
        <button
          onClick={() =>
            actions.updateTodo({ ...data.todo, title: editedTitle() })
          }>
          Save
        </button>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit</button>
      )}

      {!data.todo.finished && (
        <button
          onClick={() => actions.updateTodo({ ...data.todo, finished: true })}>
          Finish
        </button>
      )}

      <button onClick={() => actions.deleteTodo(data.todo.id)}>Delete</button>
    </div>
  );
};

const ListTodos = (props) => {
  const memo = children(() => props.children);
  const [counter, setCounter] = createSignal(0);

  createEffect(() => setCounter(memo().length));
  // Below code won't work (because props.children.length is not "reactive"?)
  // createEffect(() => setCounter(props.children.length));

  return (
    <div class={styles.todo}>
      <div>{memo()}</div>
      {/* <div>{props.children}</div> */}
      <p>Total todos: {counter()}</p>
    </div>
  );
};

const AddTodos = (props) => {
  const [title, setTitle] = createSignal("");

  const addTodo = () => {
    props.addTodo({ id: props.count, title: title(), finished: false });
    setTitle("");
  };

  return (
    <div>
      <input
        type="text"
        onInput={(e) => setTitle(e.target.value)}
        value={title()}
      />
      {title && <button onClick={addTodo}>Add</button>}
    </div>
  );
};

function App() {
  const [todos, setTodos] = createSignal([]);

  return (
    <div>
      <div>
        <h4>Simple Todo App</h4>
        <AddTodos
          addTodo={(todo) => setTodos([...todos(), todo])}
          count={todos().length}
        />

        <ListTodos>
          <For each={todos()}>
            {(todo) => (
              <Todo
                todo={todo}
                updateTodo={(newTodo) =>
                  setTodos(
                    todos().map((t) => (t.id === newTodo.id ? newTodo : t))
                  )
                }
                deleteTodo={(todoId) =>
                  setTodos(todos().filter((t) => t.id !== todoId))
                }
              />
            )}
          </For>
        </ListTodos>
      </div>

      <div>
        <h4>(WIP)</h4>
      </div>
    </div>
  );
}

export default App;

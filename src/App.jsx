import { createMemo, createSignal } from "solid-js";

const formattedTodo = (todo) =>
  createMemo(() => `${todo.title} - ${todo.finished ? "DONE" : "ACTIVE"}`);

const Todo = (props) => {
  const [editedTitle, setEditedTitle] = createSignal(props.todo.title);
  const [editMode, setEditMode] = createSignal(false);

  return (
    <>
      {editMode() ? (
        <input
          value={editedTitle()}
          onInput={(e) => setEditedTitle(e.target.value)}
        />
      ) : (
        <p>{formattedTodo(props.todo)()}</p>
      )}

      {editMode() ? (
        <button
          onClick={() =>
            props.updateTodo({ ...props.todo, title: editedTitle() })
          }>
          Save
        </button>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit</button>
      )}

      {!props.todo.finished && (
        <button
          onClick={() => props.updateTodo({ ...props.todo, finished: true })}>
          Finish
        </button>
      )}

      <button onClick={() => props.deleteTodo(props.todo)}>Delete</button>
    </>
  );
};

const ListTodos = (props) => {
  return (
    <div>
      <For each={props.todos}>
        {(todo) => (
          <Todo
            todo={todo}
            updateTodo={props.updateTodo}
            deleteTodo={props.deleteTodo}
          />
        )}
      </For>
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
    <>
      <input
        type="text"
        onInput={(e) => setTitle(e.target.value)}
        value={title()}
      />
      {title && <button onClick={addTodo}>Add</button>}
    </>
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

        <ListTodos
          updateTodo={(todo) =>
            setTodos(todos().map((t) => (t.id === todo.id ? todo : t)))
          }
          deleteTodo={(todo) =>
            setTodos(todos().filter((t) => t.id !== todo.id))
          }
          todos={todos()}
        />
      </div>

      <div>
        <h4>(WIP)</h4>
      </div>
    </div>
  );
}

export default App;

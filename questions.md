# Questions and Answers for React Concepts

## 1. What is the difference between Component and PureComponent? Give an example where it might break my app

### Answer

PureComponent only re-renders if there is a shallow difference in state or props. Component doesn't do any comparison of props and state.

```jsx
class User extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.user.accountNumber}
      </div>
    );
  }
}
```

If parent component is mutating "user" object without creating a new refrence, for example "user.accountNumber=797797987", changes will not reflect on User component and we might expect them to reflect.

---

## 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

### Answer

We might be using shouldComponentUpdate to prevent some re-renders based on state and props changes, but if we have context consumer in same component, changes in context will not cause a re-render as shouldComponentUpdate will prevent it.

Example:

```jsx
import React from 'react';

const UserContext = React.createContext();

class User extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.id !== nextProps.id;
  }

  render() {
    return (
      <UserContext.Consumer>
        {contextData => <div>{contextData}</div>}
      </UserContext.Consumer>
    );
  }
}

function App() {
  const [userMessage, setUserMessage] = React.useState("");

  return (
    <UserContext.Provider value={userMessage}>
      <User id="1" />
      <button onClick={() => setUserMessage("Hello")}>Change Message</button>
    </UserContext.Provider>
  );
}

```

---

## 3. Describe 3 ways to pass information from a component to its parent

### Answer

1. Callback Functions as a prop

The parent component can pass a callback function as a prop to the child component. The child component then calls this function, passing data with it, whenever it needs to communicate back to the parent.

2. Callback Functions through Context

When child is deeply nested we might want to use React Context to pass a callback function. The child component can call this function and pass the data.

3. Using State Management Library

This allows shared state between components. It isn't direct parent-child communication, but it allows any component to update the state, and any component to listen to that state. So child can update some part of global state and parent to listen to that change.

---

## 4. Give 2 ways to prevent components from re-rendering

### Answer

1. React.memo

Used with functional components.
A Higher order component that will skip re-rendering of passed component if props don't change. It does shallow comparison of props.

2. shouldComponentUpdate

Used with class components.
A lifecycle method that receives state and props changes and can prevent re-rendering by returning "false".

---

## 5. What is a fragment and why do we need it? Give an example where it might break my app

### Answer

Fragment is virtual element that lets you group elements/children without adding extra nodes to the DOM. It has no representation in real DOM.

It can break app only if you forget that you are using it. For example it can break a layout because you considered that certain styles like `display: 'flex'` will not apply to children if you wrap them in fragment. They will apply.

```jsx

function Example() {
  return (
    <div style={{ display: 'flex' }}>
      <>
        <div>Box 1</div>
        <div>Box 2</div>
        <div>Box 3</div>
      </>
    </div>
  );
}

```
---

## 6. Give 3 examples of the HOC pattern

### Answer

1. `withTheme` providing a theme from context to the component through props

```jsx
function withTheme(Component) {
  return function(props) {
    const theme = useContext(ThemeContext);  
    return <Component {...props} theme={theme} />;
  };
}

const User = ({ theme }) => (
  <div style={{ color: theme.primaryColor }}>Me</div>
);

const ThemedComponent = withTheme(User);
```

2. `withDataFetching` enhances the component with data fetching

```jsx

function withDataFetching(Component, url) {
  return function(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    }, [url]);

    if (loading) return <div>Loading</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <Component {...props} data={data} />;
  };
}

const User = ({ data }) => (
  <div>{data.user.name}</div>
);

const UserWithName = withDataFetching(User, 'https://example.com/user');
```

3. `withAccess` redicts a user if he doesn't have access

```jsx
function withAccess(Component) {
    return function(props) {
        const { isLoggedin } = props;
        if(!isLoggedin) {
            return <Redirect link="login"/>
        }
        return <Component {...props}>
    }
}
```

---

## 7. What's the difference in handling exceptions in promises, callbacks and async...await?

### Answer

Promises catch the error with .catch method on Promise object.

```js
fetchData(url)
.then(data => setData(data))
.catch(error => setError(error))
```

In Async/await case we surround await part with try/catch.

```js
async function handleClick() {
    try {
        const data = await fetchData(url);
        setData(data);
    } catch(error) {
       setError(error);
    }
}
```

With callbacks we pass an error as any other data to the callback function.

```js
function callback(data, error) {
    if(error) {
        setError(error);
    } else {
        setData(data);
    }
}

function getData(key, callback) {
    const data = localStorage.getItem(key);
    if(!data) {
        callback(null, new Error("Data not found"));
    } else {
        callback(data, null); 
    }
}

```

---

## 8. How many arguments does setState take and why is it async

### Answer

`setState` takes two arguments:
1. Object (new state) or a function that will take current state and return new state.
2. Callback function that will be called after state is updated.

It is async because of the way React does renders and performance optimisations.

---

## 9. List the steps needed to migrate a Class to Function Component

### Answer

1. Change the signiture from class to function.
2. Everything that was in `render` put in `return`.
3. Migrate lifecycle methods one by one to hooks and other patterns (like React.memo, React.forwardRefs).

---

## 10. List a few ways styles can be used with components

### Answer

1. CSS modules
2. Plain CSS files
3. Inline styles
4. styled-components type of libraries
5. utility class libraries as TailwindCss

---

## 11. How to render an HTML string coming from the server

### Answer

Rendering of HTML string coming from the server can be done in 2 ways:

1. By using `dangerouslySetInnerHTML` with caution that string is first sanitised.
2. By using some library that can parse string and render each element separately. Usually these libs do sanitisation automaticaly.

---

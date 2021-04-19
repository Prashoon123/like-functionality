import "./App.css";
import CardComponent from "./components/Card";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db, provider } from "./firebase";
import { Button, TextField } from "@material-ui/core";
import { useState } from "react";
import firebase from "firebase";

function App() {
  const [user] = useAuthState(auth);
  const [posts] = useCollection(
    db.collection("posts").orderBy("createdAt", "asc")
  );
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const login = () => {
    auth
      .signInWithPopup(provider)
      .then((authUser) => {
        db.collection("users").doc(authUser?.user.uid).set(
          {
            id: authUser.user.uid,
            name: authUser.user.displayName,
            email: authUser.user.email,
          },
          { merge: true }
        );
      })
      .catch((error) => alert(error.message));
  };

  const logout = () => {
    auth.signOut();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("posts").add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      message,
      title,
      createdBy: user.uid,
      likes: 0,
      displayName: user.displayName,
    });

    setTitle("");
    setMessage("");
  };

  return (
    // BEM naming convention
    <div className="app">
      {!user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Button variant="contained" color="primary" onClick={login}>
            Login
          </Button>
        </div>
      ) : (
        <div
          style={{
            height: "100vh",
          }}
        >
          <form
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "column",
              marginTop: 30,
            }}
          >
            <TextField
              id="filled-basic"
              label="Enter a title"
              variant="filled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div style={{ height: 10 }} />
            <TextField
              id="filled-basic"
              label="Enter a message"
              variant="filled"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div style={{ height: 10 }} />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              type="submit"
              disabled={!title || !message}
            >
              Submit
            </Button>
          </form>
          <div style={{ height: 30 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {posts?.docs.map((post) => (
              <CardComponent
                title={post.data().title}
                creatorName={post.data().displayName.substring(0, 1)}
                name={post.data().displayName}
                date={post.data().createdAt}
                message={post.data().message}
                key={post.id}
                id={post.id}
                admin={user.uid === post.data().createdBy}
                likes={post.data().likes}
              />
            ))}
            <div style={{ height: 10 }} />
            <Button variant="contained" color="primary" onClick={logout}>
              Logout
            </Button>
            <div style={{ height: 10 }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { ThumbUp } from "@material-ui/icons";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function CardComponent({
  creatorName,
  title,
  message,
  date,
  id,
  admin,
  likes,
  name,
}) {
  const classes = useStyles();
  const [showMenu, setShowMenu] = useState(null);
  const [user] = useAuthState(auth);
  const [liked, setLiked] = useState(null);

  const deletePost = () => {
    handleClose();

    const confirm = window.confirm("Are you sure you want to delete this?");
    if (confirm) {
      db.collection("posts").doc(id).delete();
    }

    db.collection("users")
      .doc(user.uid)
      .set(
        {
          [id]: firebase.firestore.FieldValue.delete(),
        },
        { merge: true }
      );
  };

  const updateTitle = () => {
    handleClose();

    const newTitle = prompt("Enter the new title -");

    if (!newTitle) return;

    db.collection("posts").doc(id).update({
      title: newTitle,
    });
  };

  const updateMessage = () => {
    handleClose();

    const newMessage = prompt("Enter the new message -");

    if (!newMessage) return;

    db.collection("posts").doc(id).update({
      message: newMessage,
    });
  };

  // eslint-disable-next-line
  const checkIfLiked = () => {
    db.collection("users")
      .doc(user?.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setLiked(snapshot.data()[id]);
        }
      });
  };

  useEffect(() => {
    checkIfLiked();
  }, [checkIfLiked]);

  const handleClick = (e) => {
    setShowMenu(e.currentTarget);
  };

  const handleClose = () => {
    setShowMenu(null);
  };

  const like = () => {
    checkIfLiked();

    if (liked !== true) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            [id]: true,
          },
          { merge: true }
        );
      db.collection("posts")
        .doc(id)
        .set(
          {
            likes: likes + 1,
          },
          { merge: true }
        );
    } else if (liked === true) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            [id]: false,
          },
          { merge: true }
        );
      db.collection("posts")
        .doc(id)
        .set(
          {
            likes: likes - 1,
          },
          { merge: true }
        );
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card color="#424242" className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="creator-pic" className={classes.avatar}>
              {creatorName}
            </Avatar>
          }
          action={
            <>
              {admin && (
                <IconButton aria-label="options">
                  <MoreVertIcon onClick={handleClick} />
                </IconButton>
              )}
              <Menu
                id="simple-menu"
                anchorEl={showMenu}
                keepMounted
                open={Boolean(showMenu)}
                onClose={handleClose}
              >
                <MenuItem onClick={deletePost}>Delete</MenuItem>
                <MenuItem onClick={updateTitle}>Update Title</MenuItem>
                <MenuItem onClick={updateMessage}>Update Message</MenuItem>
              </Menu>
            </>
          }
          title={name}
          subheader={new Date(date?.toDate()).toUTCString()}
        />
        <CardContent>
          <Typography color="textPrimary" component="h2">
            {message}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="like post">
            {liked ? (
              <ThumbUp style={{ color: "#3EA6FF" }} onClick={like} />
            ) : (
              <ThumbUp onClick={like} />
            )}
          </IconButton>
          {liked ? (
            <Typography style={{ color: "#327AB8" }} component="p">
              {likes}
            </Typography>
          ) : (
            <Typography component="p">{likes}</Typography>
          )}
        </CardActions>
      </Card>
      <div style={{ height: 10 }} />
    </ThemeProvider>
  );
}

export default CardComponent;

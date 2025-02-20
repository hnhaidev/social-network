import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Icon,
  Image,
  Divider,
  Button,
  Popup,
  Header,
  Modal,
} from "semantic-ui-react";
import io from "socket.io-client";
import baseUrl from "../../utils/baseUrl";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import { deletePost, likePost } from "../../utils/postActions";
import LikesList from "./LikesList";
import ImageModal from "./ImageModal";
import NoImageModal from "./NoImageModal";

function CardPost({ post, user, setPosts, setShowToastr }) {
  const [likes, setLikes] = useState(post.likes);
  const socket = useRef();

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [comments, setComments] = useState(post.comments);

  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments,
  });

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
  }, []);

  return (
    <>
      {showModal && (
        <Modal
          open={showModal}
          closeIcon
          closeOnDimmerClick
          onClose={() => setShowModal(false)}
        >
          <Modal.Content>
            {post.picUrl ? (
              <ImageModal {...addPropsToModal()} />
            ) : (
              <NoImageModal {...addPropsToModal()} />
            )}
          </Modal.Content>
        </Modal>
      )}

      <Card color="teal" fluid style={{ border: "1px solid rgba(0,0,0,.1" }}>
        <Card.Content>
          <Image floated="left" src={post.user.profilePicUrl} avatar circular />

          {(user.role === "root" || post.user._id === user._id) && (
            <>
              <Popup
                on="click"
                position="top right"
                trigger={
                  <Image
                    src="/deleteIcon.svg"
                    style={{ cursor: "pointer", width: "20px" }}
                    size="mini"
                    floated="right"
                  />
                }
              >
                <Header as="h4" content="Bạn có chắc chắn muốn xóa?" />
                <p>Hành động này là không thể hoàn tác!</p>

                <Button
                  color="red"
                  icon="trash"
                  content="Delete"
                  onClick={() => deletePost(post._id, setPosts, setShowToastr)}
                />
              </Popup>
            </>
          )}

          <Card.Header
            style={{
              fontSize: "1.1em",
            }}
          >
            <Link href={`/${post.user.username}`}>{post.user.name}</Link>
          </Card.Header>

          <Card.Meta
            style={{
              fontSize: "0.8em",
            }}
          >
            {calculateTime(post.createdAt)}
          </Card.Meta>

          {post.location && (
            <Card.Meta
              style={{
                fontSize: "0.8em",
              }}
              content={post.location}
            />
          )}

          <Card.Description
            style={{
              fontSize: "1em",
              letterSpacing: "0.1px",
              wordSpacing: "0.35px",
            }}
          >
            {post.text}
          </Card.Description>
        </Card.Content>

        {post.picUrl && (
          <Image
            src={post.picUrl}
            style={{ cursor: "pointer" }}
            floated="left"
            wrapped
            ui={false}
            alt="PostImage"
            onClick={() => setShowModal(true)}
          />
        )}
        <Card.Content extra>
          <Icon
            name={isLiked ? "heart" : "heart outline"}
            color="red"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (socket.current) {
                socket.current.emit("likePost", {
                  postId: post._id,
                  userId: user._id,
                  like: isLiked ? false : true,
                });

                socket.current.on("postLiked", () => {
                  if (isLiked) {
                    setLikes((prev) =>
                      prev.filter((like) => like.user !== user._id)
                    );
                  }
                  //
                  else {
                    setLikes((prev) => [...prev, { user: user._id }]);
                  }
                });
              } else {
                likePost(post._id, user._id, setLikes, isLiked ? false : true);
              }
            }}
          />

          <LikesList
            postId={post._id}
            trigger={
              likes.length > 0 && (
                <span className="spanLikesList">
                  {`${likes.length} lượt thích`}
                </span>
              )
            }
          />

          <Icon
            name="comment alternate outline"
            style={{ marginLeft: "15px", cursor: "pointer" }}
            color="blue"
            onClick={() => setShowModal(true)}
          />

          {comments.length > 0 && (
            <span className="spanLikesList" onClick={() => setShowModal(true)}>
              {`${comments.length} bình luận`}
            </span>
          )}

          <Divider />

          {comments.length > 0 &&
            comments.map(
              (comment, i) =>
                i < 3 && (
                  <PostComments
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    user={user}
                    setComments={setComments}
                  />
                )
            )}

          {comments.length > 3 && (
            <Button
              content="Xem thêm"
              color="teal"
              basic
              circular
              onClick={() => setShowModal(true)}
            />
          )}

          <Divider hidden />

          <CommentInputField
            user={user}
            postId={post._id}
            setComments={setComments}
          />
        </Card.Content>
      </Card>
      <Divider hidden />
    </>
  );
}

export default CardPost;

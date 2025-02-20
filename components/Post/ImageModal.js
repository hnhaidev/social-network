import React from "react";
import { Modal, Grid, Image, Card, Icon, Divider } from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputField";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import { likePost } from "../../utils/postActions";
import LikesList from "./LikesList";

function ImageModal({
  post,
  user,
  setLikes,
  likes,
  isLiked,
  comments,
  setComments,
}) {
  return (
    <>
      <Grid columns={2} stackable relaxed>
        <Grid.Column>
          <Modal.Content image>
            <Image wrapped size="large" src={post.picUrl} />
          </Modal.Content>
        </Grid.Column>

        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <img
                src={post.user.profilePicUrl}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  marginRight: "1em",
                  float: "left",
                }}
              />

              <Card.Header>
                <Link href={`/${post.user.username}`}>
                  <a>{post.user.name}</a>
                </Link>
              </Card.Header>

              <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

              {post.location && (
                <Card.Meta
                  content={post.location}
                  style={{ marginLeft: "3.5rem" }}
                />
              )}

              <Card.Description
                style={{
                  fontSize: "17px",
                  letterSpacing: "0.1px",
                  wordSpacing: "0.35px",
                }}
              >
                {post.text}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Icon
                name={isLiked ? "heart" : "heart outline"}
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  likePost(post._id, user._id, setLikes, isLiked ? false : true)
                }
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
                style={{ marginLeft: "15px" }}
                color="blue"
              />

              {comments.length > 0 && (
                <span>{`${comments.length} bình luận`}</span>
              )}

              <Divider hidden />

              <div
                style={{
                  overflow: "auto",
                  height: comments.length > 2 ? "200px" : "60px",
                  marginBottom: "8px",
                }}
              >
                {comments.length > 0 &&
                  comments.map((comment) => (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  ))}
              </div>

              <CommentInputField
                postId={post._id}
                user={user}
                setComments={setComments}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default ImageModal;

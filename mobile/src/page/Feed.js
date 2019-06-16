import React, { Component } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import io from "socket.io-client";
import { FlatList } from "react-native-gesture-handler";
import api from "../services/api";

import camera from "../assets/camera.png";
import more from "../assets/more.png";
import like from "../assets/like.png";
import comment from "../assets/comment.png";
import send from "../assets/send.png";

export default class Feed extends Component {
  state = {
    feed: []
  };

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate("New")}
        style={{ marginRight: 20 }}
      >
        <Image source={camera} />
      </TouchableOpacity>
    )
  });

  async componentDidMount() {
    const response = await api.get("posts");
    console.log(response.data);

    this.setState({ feed: response.data });
    this.registerToSocket();
  }
  registerToSocket = () => {
    const socket = io("http://localhost:3333");

    socket.on("post", newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on("like", likePost => {
      const posts = this.state.feed.map(post =>
        post._id === likePost._id ? likePost : post
      );

      this.setState({ feed: posts });
    });
  };
  handleLike = id => {
    api.post(`posts/${id}/like`);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.name}> {item.author} </Text>
                  <Text style={styles.place}> {item.place} </Text>
                </View>
                <Image source={more} />
              </View>

              <Image
                style={styles.feedImage}
                source={{ uri: `http://localhost:3333/files/${item.image}` }}
              />

              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => this.handleLike(item._id)}
                    style={styles.action}
                  >
                    <Image source={like} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Image source={comment} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action}>
                    <Image source={send} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.likes}>{item.likes} curtidas</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  feedItem: {
    marginTop: 20
  },

  feedItemHeader: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    fontSize: 14,
    color: "#000"
  },

  place: {
    fontSize: 12,
    color: "#666",
    marginTop: 2
  },

  feedImage: {
    width: "100%",
    height: 400,
    marginVertical: 15
  },

  feedItemFooter: {
    paddingHorizontal: 15
  },

  actions: {
    flexDirection: "row"
  },

  action: {
    marginRight: 8
  },

  likes: {
    marginTop: 15,
    fontWeight: "bold",
    color: "#000"
  },

  description: {
    lineHeight: 18,
    color: "#000"
  },

  hashtags: {
    color: "#7159c1"
  }
});

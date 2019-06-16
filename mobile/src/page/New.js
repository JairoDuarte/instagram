import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput
} from "react-native";
import ImagePicker from "react-native-image-picker";

import api from "../services/api";

export default class New extends Component {
  state = {
    image: null,
    author: "",
    place: "",
    description: "",
    hashtags: "",
    preview: null
  };

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "Nova publicação"
  });

  handleSelectImage = () => {
    ImagePicker.showImagePicker(
      {
        title: "Selectionar imagem"
      },
      upload => {
        if (upload.error) {
          console.log("Error");
        } else if (upload.didCancel) {
          console.log("Used canceled");
        } else {
          const preview = {
            uri: `data:image/jpeg;base64,${upload.data}`
          };
          let prefix;
          let ext;
          if (upload.fileName) {
            [prefix, ext] = upload.fileName.split(".");
            ext = ext.toLowerCase() === "heic" ? "jpg" : ext;
          } else {
            prefix = new Date().getTime();
            ext = "jpg";
          }

          const image = {
            uri: upload.uri,
            type: upload.type,
            name: `${prefix}.${ext}`
          };

          this.setState({ preview, image });
        }
      }
    );
  };
  handleSubimit = async e => {
    const { image, author, place, description, hashtags } = this.state;
    const data = new FormData();
    data.append("image", image);
    data.append("author", author);
    data.append("place", place);
    data.append("description", description);
    data.append("hashtags", hashtags);

    await api.post("posts", data);

    this.props.navigation.navigate("Feed");
  };

  render() {
    const { author, place, description, hashtags } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => this.handleSelectImage()}
        >
          <Text style={styles.selectButtonText}> Selectionar imagem</Text>
        </TouchableOpacity>
        {this.state.preview && (
          <Image style={styles.preview} source={this.state.preview} />
        )}
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nome do autor"
          placeholderTextColor="#999"
          onChangeText={author => this.setState({ author })}
          value={author}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Local da foto"
          placeholderTextColor="#999"
          onChangeText={place => this.setState({ place })}
          value={place}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Descrição"
          placeholderTextColor="#999"
          onChangeText={description => this.setState({ description })}
          value={description}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Hashtags"
          placeholderTextColor="#999"
          onChangeText={hashtags => this.setState({ hashtags })}
          value={hashtags}
        />
        <TouchableOpacity
          style={styles.shareButton}
          onPress={this.handleSubimit}
        >
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    borderStyle: "dashed",
    height: 42,

    justifyContent: "center",
    alignItems: "center"
  },

  selectButtonText: {
    fontSize: 16,
    color: "#666"
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 4
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginTop: 10,
    fontSize: 16
  },

  shareButton: {
    backgroundColor: "#7159c1",
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: "center",
    alignItems: "center"
  },

  shareButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFF"
  }
});

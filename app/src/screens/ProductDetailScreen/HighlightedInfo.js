import React from "react";
import { Dimensions } from "react-native";
import { Card } from "react-native-paper";
import HTML from "react-native-render-html";

const HighlightedInfo = ({ highlights }) => {
  if (!highlights) {
    return null;
  }

  return (
    <Card style={{ flex: 1 }}>
      <Card.Title title="Highlighted Info" />
      <Card.Content>
        <HTML 
          source={{ html: highlights }} 
          contentWidth={Dimensions.get("window").width} 
        />
      </Card.Content>
    </Card>
  );
};

export default HighlightedInfo;

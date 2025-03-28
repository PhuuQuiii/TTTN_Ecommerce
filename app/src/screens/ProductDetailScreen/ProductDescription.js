import React from "react";
import { Text, View } from "react-native";
import { Avatar, Card, Divider, Paragraph } from "react-native-paper";
import { useSelector } from "react-redux";
import { getDiscountedAmount } from "../../../utils/common";
import Constants from "../../constants/Constants";
import ConciseQnA from "./ConciseQnA";
import ConcideRating from "./ConciseRating";
import HighlightedInfo from "./HighlightedInfo";
import YoutubePlayer from "./YoutubePlayer";

const ProductDescription = ({ productDetails }) => {
  const { token } = useSelector((state) => state.authentication);

  const { product } = productDetails;

  return (
    <>
      <Card>
        <View>
          <Card.Title
            title={
              <Text
                style={{
                  color: Constants.primaryGreen,
                  fontWeight: "bold",
                }}
              >
              {getDiscountedAmount(product.price.$numberDecimal, product.discountRate)} đ
              </Text>
            }
            subtitle={
              <>
                <Text
                  style={{
                    textDecorationLine: "line-through",
                    textDecorationStyle: "solid",
                  }}
                >
                  {`${product.price.$numberDecimal} đ`}
                </Text>
                <Text
                  style={{
                    color: "green",
                  }}
                >
                  {` ${product.discountRate}% off`}
                </Text>
              </>
            }
          />
        </View>
        <Card.Content>
          <Paragraph>{product.description}</Paragraph>
          <Avatar.Text
            size={24}
            label={`Rating: ${Math.ceil(product.stars.averageStar)}/5`}
            color="white"
            backgroundColor={Constants.primaryGreen}
            width={90}
            style={{ marginTop: 10 }}
          />
        </Card.Content>
      </Card>
      <Divider />
      <Card>
        <Card.Title title="Additional Information" />

        <Card.Content>
          <Paragraph style={{ fontWeight: "bold" }}>
            Weight: {product.weight.map((w) => w).join(" ")}
          </Paragraph>
          {/* <Paragraph style={{ fontWeight: "bold" }}>
            Dimension: 1080x2340
          </Paragraph> */}
          <Paragraph style={{ fontWeight: "bold" }}>
            Color: {product.color.map((c) => c).join(" ")}
          </Paragraph>
          <Paragraph style={{ fontWeight: "bold" }}>
            Warrenty: {product.warranty}
          </Paragraph>
        </Card.Content>
      </Card>
      <Divider />
      <HighlightedInfo highlights={product.highlights} />
      <Divider />
      <YoutubePlayer />
      <Divider />
      <ConcideRating token={token} {...product}/>
      <Divider />
      <ConciseQnA token={token} {...product}/>
      <Divider />
    </>
  );
};

export default ProductDescription;

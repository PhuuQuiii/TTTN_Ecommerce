import React, { useState } from "react";
import { Steps } from "antd";
import AddProduct from "./AddProduct";
import AddInformation from "./AddInformation";

const { Step } = Steps;

const AddSale = () => {
  const [current, setCurrent] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleDetails, setSaleDetails] = useState({
    saleName: "",
    date: "",
    time: "",
  });

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current}>
        <Step title="Select Product" />
        <Step title="Sale Details" />
      </Steps>
      {current === 0 && (
        <AddProduct onSelectProduct={setSelectedProduct} next={next} />
      )}
      {current === 1 && (
        <AddInformation
          saleDetails={saleDetails}
          setSaleDetails={setSaleDetails}
          prev={prev}
        />
      )}
    </>
  );
};

export default AddSale;

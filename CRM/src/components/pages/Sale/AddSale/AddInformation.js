import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, TimePicker, Button } from "antd";
import PropTypes from "prop-types";

const AddInformation = ({ layout, onSubmit, onPrevious }) => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        onSubmit(values);
    };

    const handlePrevious = () => {
        onPrevious();
    };

    return (
        <>
            <Form
                {...layout}
                form={form}
                name="detail_information"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Sale Name"
                    name="saleName"
                    rules={[{ required: true, message: "Please input the sale name!" }]}
                >
                    <Input placeholder="Enter sale name" />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: "Please select the sale date!" }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Time"
                    name="time"
                    rules={[{ required: true, message: "Please select the sale time!" }]}
                >
                    <TimePicker style={{ width: '100%' }} />
                </Form.Item>

                <div className="steps-action">
                    <Button style={{ margin: "0 8px" }} onClick={handlePrevious}>
                        Previous
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Next
                    </Button>
                </div>
            </Form>
        </>
    );
};

AddInformation.propTypes = {
    layout: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
};

export default AddInformation;
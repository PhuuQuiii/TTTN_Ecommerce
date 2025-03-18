import {
  InfoCircleTwoTone
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import './Todo.css';

const Todo = ({ user, completedPercent }) => {
  const getStatus = (condition) => {
    if (condition) {
      return {
        // icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
        text: "Completed",
        color: "success",
        hoverable: false
      };
    } else {
      return {
        // icon: <ClockCircleTwoTone twoToneColor="#faad14" />,
        text: "Pending",
        color: "warning",
        hoverable: true
      };
    }
  };

  const todoItems = [
    {
      title: "Profile",
      description: "Complete your profile",
      link: '/profile',
      condition: user?.shopName,
      details: "Add your shop name and basic information"
    },
    {
      title: "Business Info",
      description: "Verify your business information",
      link: '/profile',
      condition: user?.businessInfo,
      details: "Add your business registration and tax information"
    },
    {
      title: "Bank Details",
      description: "To receive your money",
      link: '/profile',
      condition: user?.adminBank,
      details: "Add your bank account for receiving payments"
    },
    {
      title: "WareHouse",
      description: "To dispatch/return your product",
      link: '/profile',
      condition: user?.adminWareHouse,
      details: "Add your warehouse location and details"
    }
  ];

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h5 className="todo-title">Setup Progress</h5>
          <Progress
            className="todo-progress"
            format={percent => `${percent}%`}
            strokeColor={{
              '0%': '#4888FFFF',
              '100%': '#B592F5FF',
            }}
            trailColor='#354052'
            percent={completedPercent}
            status="active"
          />
        </div>
        <div className="todo-body">
          <Row gutter={[16, 16]}>
            {todoItems.map((item, index) => {
              const status = getStatus(item.condition);
              return (
                <Col xs={24} sm={12} md={12} lg={6} key={index}>
                  <Link to={status.hoverable ? item.link : '#'} className="todo-item-link">
                    <Card
                      className={`todo-item-card ${status.hoverable ? 'hoverable' : ''}`}
                      title={
                        <div className="todo-item-title">
                          <span>{item.title}</span>
                          <Tooltip title={status.text}>
                            {status.icon}
                          </Tooltip>
                        </div>
                      }
                      extra={
                        <Tooltip title={item.details}>
                          <InfoCircleTwoTone twoToneColor="#1890ff" />
                        </Tooltip>
                      }
                    >
                      <div className="todo-item-content">
                        <p className="todo-item-description">{item.description}</p>
                        <Tag color={status.color} className="todo-item-tag">
                          {status.text}
                        </Tag>
                      </div>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

Todo.propTypes = {
  user: PropTypes.object.isRequired,
  completedPercent: PropTypes.number.isRequired
};

export default Todo;

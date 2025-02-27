import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order #1</Card.Title>
              <Card.Text>
                Details about order #1.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order #2</Card.Title>
              <Card.Text>
                Details about order #2.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order #3</Card.Title>
              <Card.Text>
                Details about order #3.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;

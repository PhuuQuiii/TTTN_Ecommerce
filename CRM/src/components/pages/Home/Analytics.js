import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics, fetchRevenue } from '../../../redux/actions/analytics_actions';

const Analytics = () => {
    const dispatch = useDispatch();
    const { analytics, revenue, loading, error } = useSelector(state => state.analytics);
    const { user } = useSelector(state => state.auth);
    const [period, setPeriod] = useState('day');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showCustomDate, setShowCustomDate] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token
            window.location.href = '/login';
            return;
        }
        dispatch(fetchAnalytics());
        fetchRevenueData();
    }, [dispatch, period, startDate, endDate]);

    const fetchRevenueData = () => {
        const params = {
            period,
            ...(showCustomDate && { startDate, endDate })
        };
        dispatch(fetchRevenue(params));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="analytics-container">
            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Analytics Overview</h5>
                    <ButtonGroup>
                        <Button 
                            variant={period === 'day' ? 'primary' : 'outline-primary'}
                            onClick={() => {
                                setPeriod('day');
                                setShowCustomDate(false);
                            }}
                        >
                            Day
                        </Button>
                        <Button 
                            variant={period === 'month' ? 'primary' : 'outline-primary'}
                            onClick={() => {
                                setPeriod('month');
                                setShowCustomDate(false);
                            }}
                        >
                            Month
                        </Button>
                        <Button 
                            variant={period === 'year' ? 'primary' : 'outline-primary'}
                            onClick={() => {
                                setPeriod('year');
                                setShowCustomDate(false);
                            }}
                        >
                            Year
                        </Button>
                        <Button 
                            variant={showCustomDate ? 'primary' : 'outline-primary'}
                            onClick={() => setShowCustomDate(!showCustomDate)}
                        >
                            Custom
                        </Button>
                    </ButtonGroup>
                </Card.Header>
                <Card.Body>
                    {showCustomDate && (
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6>Total Revenue</h6>
                                    <h3>{formatCurrency(revenue)}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6>Completed Orders</h6>
                                    <h3>{analytics?.completedOrders || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6>Pending Orders</h6>
                                    <h3>{analytics?.pendingOrders || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card className="stat-card">
                                <Card.Body>
                                    <h6>Cancelled Orders</h6>
                                    <h3>{analytics?.cancelledOrders || 0}</h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Top Products</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="chart-container">
                                {/* Add chart component here */}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Returned Products</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="chart-container">
                                {/* Add chart component here */}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analytics; 
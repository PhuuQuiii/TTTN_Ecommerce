import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import CountUp from 'react-countup';
import { FaCalendar, FaCalendarAlt, FaCalendarDay, FaChartLine, FaInfinity } from 'react-icons/fa';
import { connect } from 'react-redux';
import { getRevenue } from '../../../redux/actions/analytics_actions';

const Revenue = ({ getRevenue, revenue, isSuperAdmin }) => {
    const [period, setPeriod] = useState('day'); // 'day', 'month', 'year', 'all'
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        setTimeout(() => {
            setIsVisible(true);
            getRevenue({ period });
        }, 100);
    }, [period, getRevenue]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <Card className="mb-4 revenue-card">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="text-muted mb-1">Total Revenue</h5>
                        <h3 className="mb-0">
                            <FaChartLine className="text-primary me-2" />
                            Statistics
                        </h3>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <ButtonGroup className="period-selector">
                            <Button 
                                variant={period === 'day' ? 'primary' : 'outline-primary'}
                                onClick={() => setPeriod('day')}
                                className="d-flex align-items-center"
                            >
                                <FaCalendarDay className="me-2" />
                                Day
                            </Button>
                            <Button 
                                variant={period === 'month' ? 'primary' : 'outline-primary'}
                                onClick={() => setPeriod('month')}
                                className="d-flex align-items-center"
                            >
                                <FaCalendarAlt className="me-2" />
                                Month
                            </Button>
                            <Button 
                                variant={period === 'year' ? 'primary' : 'outline-primary'}
                                onClick={() => setPeriod('year')}
                                className="d-flex align-items-center"
                            >
                                <FaCalendar className="me-2" />
                                Year
                            </Button>
                            <Button 
                                variant={period === 'all' ? 'primary' : 'outline-primary'}
                                onClick={() => setPeriod('all')}
                                className="d-flex align-items-center"
                            >
                                <FaInfinity className="me-2" />
                                All Time
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="revenue-display">
                    <div className="display-4 font-weight-bold text-primary mb-2" style={{ fontFamily: 'Digital-7, monospace' }}>
                        {isVisible && (
                            <CountUp
                                start={0}
                                end={revenue}
                                duration={3}
                                separator=","
                                decimal="."
                                useEasing={true}
                                easingFn={(t, b, c, d) => {
                                    return c * (t / d) + b;
                                }}
                                suffix=" đ"
                            />
                        )}
                    </div>
                    <div className="text-muted period-label">
                        {period === 'day' && 'Today\'s Revenue'}
                        {period === 'month' && 'This Month\'s Revenue'}
                        {period === 'year' && 'This Year\'s Revenue'}
                        {period === 'all' && 'All Time Revenue'}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

const mapStateToProps = state => ({
    revenue: state.analytics.revenue,
    isSuperAdmin: state.auth.user?.role === 'superadmin'
});

export default connect(mapStateToProps, { getRevenue })(Revenue);
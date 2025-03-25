import PropTypes from 'prop-types';
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaChartBar, FaChartPie, FaClock, FaShoppingCart, FaTimesCircle, FaUndo, FaUsers } from 'react-icons/fa';

const Graph = ({ analytics, isSuperAdmin }) => {
    // Calculate percentages for daily data
    const totalDailyOrders = (analytics?.daily?.completedOrders || 0) + 
                            (analytics?.daily?.pendingOrders || 0) + 
                            (analytics?.daily?.cancelledOrders || 0);
    const completedDailyPercentage = totalDailyOrders > 0 ? 
        Math.round((analytics?.daily?.completedOrders / totalDailyOrders) * 100) : 0;
    const pendingDailyPercentage = totalDailyOrders > 0 ? 
        Math.round((analytics?.daily?.pendingOrders / totalDailyOrders) * 100) : 0;
    const cancelledDailyPercentage = totalDailyOrders > 0 ? 
        Math.round((analytics?.daily?.cancelledOrders / totalDailyOrders) * 100) : 0;

    // Calculate percentages for monthly data
    const totalMonthlyOrders = (analytics?.monthly?.completedOrders || 0) + 
                              (analytics?.monthly?.pendingOrders || 0) + 
                              (analytics?.monthly?.cancelledOrders || 0);
    const completedMonthlyPercentage = totalMonthlyOrders > 0 ? 
        Math.round((analytics?.monthly?.completedOrders / totalMonthlyOrders) * 100) : 0;
    const pendingMonthlyPercentage = totalMonthlyOrders > 0 ? 
        Math.round((analytics?.monthly?.pendingOrders / totalMonthlyOrders) * 100) : 0;
    const cancelledMonthlyPercentage = totalMonthlyOrders > 0 ? 
        Math.round((analytics?.monthly?.cancelledOrders / totalMonthlyOrders) * 100) : 0;

    // Calculate customer growth percentage (only for superadmin)
    const customerGrowthPercentage = isSuperAdmin && analytics?.monthly?.newCustomers > 0 ? 
        Math.round((analytics?.monthly?.newCustomers / analytics?.daily?.newCustomers) * 100) : 0;

    const salesData = {
        datasets: [{
            label: 'Revenue',
            type: 'line',
            data: [analytics?.daily?.totalSales || 0, analytics?.monthly?.totalSales || 0],
            fill: false,
            borderColor: '#4e73df',
            backgroundColor: '#4e73df',
            pointBorderColor: '#4e73df',
            pointBackgroundColor: '#4e73df',
            pointHoverBackgroundColor: '#4e73df',
            pointHoverBorderColor: '#4e73df',
            yAxisID: 'y-axis-2',
            tension: 0.4
        }]
    };

    if (isSuperAdmin) {
        salesData.datasets.push({
            type: 'bar',
            label: 'Customers',
            data: [analytics?.daily?.newCustomers || 0, analytics?.monthly?.newCustomers || 0],
            fill: false,
            backgroundColor: '#1cc88a',
            borderColor: '#1cc88a',
            hoverBackgroundColor: '#1cc88a',
            hoverBorderColor: '#1cc88a',
            yAxisID: 'y-axis-1'
        });
    }

    const salesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        scales: {
            xAxes: [
                {
                    display: true,
                    gridLines: {
                        display: false
                    },
                    labels: ['Today', 'This Month']
                }
            ],
            yAxes: [
                {
                    type: 'linear',
                    display: isSuperAdmin,
                    position: 'left',
                    id: 'y-axis-1',
                    gridLines: {
                        display: false
                    }
                },
                {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    id: 'y-axis-2',
                    gridLines: {
                        display: false
                    }
                }
            ]
        }
    };

    const doughnutData = {
        labels: ['Pending', 'Completed', 'Cancelled'],
        datasets: [{
            data: [
                analytics?.daily?.pendingOrders || 0,
                analytics?.daily?.completedOrders || 0,
                analytics?.daily?.cancelledOrders || 0
            ],
            backgroundColor: [
                '#4e73df',
                '#1cc88a',
                '#e74a3b'
            ],
            hoverBackgroundColor: [
                '#4e73df',
                '#1cc88a',
                '#e74a3b'
            ],
            borderWidth: 0
        }]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            title: {
                display: true,
                text: 'Daily Order Status',
                position: 'top',
                font: {
                    size: 16
                }
            }
        },
        cutout: '70%'
    };

    const returnedProductData = {
        labels: analytics?.all?.topReturnedProducts?.map(item => item.product?.name || 'Unknown') || [],
        datasets: [
            {
                label: 'Top 6 Returned Products',
                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(78, 115, 223, 0.4)',
                hoverBorderColor: 'rgba(78, 115, 223, 1)',
                data: analytics?.all?.topReturnedProducts?.map(item => item.returnCount) || []
            }
        ]
    };

    const returnedProductOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    }
                }
            ]
        }
    };

    return (
        <>
            <div className="col-lg-6 col-xl-5 d-flex">
                <div className="w-100">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="card flex-fill stat-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="stat-icon bg-primary">
                                            <FaShoppingCart />
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="text-muted mb-1">Completed Orders</h6>
                                            <h4 className="mb-0">{analytics?.daily?.completedOrders || 0}</h4>
                                            <small className="text-muted">Daily</small>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${completedDailyPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card flex-fill stat-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="stat-icon bg-info">
                                            <FaClock />
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="text-muted mb-1">Pending Orders</h6>
                                            <h4 className="mb-0">{analytics?.daily?.pendingOrders || 0}</h4>
                                            <small className="text-muted">Daily</small>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar bg-info" role="progressbar" style={{ width: `${pendingDailyPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card flex-fill stat-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="stat-icon bg-warning">
                                            <FaUsers />
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="text-muted mb-1">New Customers</h6>
                                            <h4 className="mb-0">{analytics?.monthly?.newCustomers || 0}</h4>
                                            <small className="text-muted">Monthly</small>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${customerGrowthPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="card flex-fill stat-card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="stat-icon bg-danger">
                                            <FaTimesCircle />
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="text-muted mb-1">Cancelled Orders</h6>
                                            <h4 className="mb-0">{analytics?.daily?.cancelledOrders || 0}</h4>
                                            <small className="text-muted">Daily</small>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${cancelledDailyPercentage}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-xl-7">
                <div className="card flex-fill w-100 chart-card">
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-4">
                            <div className="chart-icon bg-primary">
                                <FaChartBar />
                            </div>
                            <h5 className="mb-0 ms-3">Revenue {isSuperAdmin ? 'VS Customers' : ''}</h5>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Bar data={salesData} options={salesOptions} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-xl-5">
                <div className="card flex-fill w-100 chart-card">
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-4">
                            <div className="chart-icon bg-success">
                                <FaChartPie />
                            </div>
                            <h5 className="mb-0 ms-3">Order Status</h5>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 col-xl-7">
                <div className="card flex-fill w-100 chart-card">
                    <div className="card-body">
                        <div className="d-flex align-items-center mb-4">
                            <div className="chart-icon bg-warning">
                                <FaUndo />
                            </div>
                            <h5 className="mb-0 ms-3">Top 6 Returned Products</h5>
                        </div>
                        <div style={{ height: '100%' }}>
                            <Bar data={returnedProductData} options={returnedProductOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Graph.propTypes = {
    analytics: PropTypes.object,
    isSuperAdmin: PropTypes.bool
};

export default Graph;

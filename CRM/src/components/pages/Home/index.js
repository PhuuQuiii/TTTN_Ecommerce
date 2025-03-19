import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getAnalytics } from '../../../redux/actions/analytics_actions';
import Layout from '../../core/Layout';
import Graph from './Graph';
import Revenue from './Revenue';
import Todo from './Todo';

const Home = ({ user, analytics, getAnalytics }) => {
  let completedPercent = 0;
  if (user?.shopName) completedPercent += 25;
  if (user?.businessInfo) completedPercent += 25;
  if (user?.adminBank) completedPercent += 25;
  if (user?.adminWareHouse) completedPercent += 25;

  useEffect(() => {
    getAnalytics();
  }, [getAnalytics]);

  return (
    <Layout>
      <div className="row">
        {/* Show Todo for all admin users */}
        <Revenue />
        {user && <Todo user={user} completedPercent={completedPercent}/>}
        <Graph analytics={analytics} />
      </div>
    </Layout>
  );
};

Home.propTypes = {
  user: PropTypes.object.isRequired,
  analytics: PropTypes.object,
  getAnalytics: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.auth.adminProfile,
  analytics: state.analytics.analytics
});

export default connect(mapStateToProps, { getAnalytics })(Home);

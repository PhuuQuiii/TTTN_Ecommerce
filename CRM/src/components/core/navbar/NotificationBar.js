import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import moment from 'moment'
import { getNotifications, readNotification } from '../../../redux/actions/notification_actions'

const NotificationBar = ({ socket, getNotifications, adminNotification, readNotification }) => { // getNotifications: Hàm lấy danh sách thông báo từ server.
	const [numberOfNotifications, setnumberOfNotifications] = useState(0) // numberOfNotifications: State lưu số lượng thông báo chưa đọc.
	useEffect(()=> {
		setnumberOfNotifications(adminNotification.noOfUnseen) // Cập nhật số lượng thông báo khi adminNotification thay đổi
	}, [adminNotification]) // // adminNotification: Object chứa thông tin về thông báo, lấy từ Redux.
	useEffect(() => {
		if (!isEmpty(socket)) { // Lắng nghe sự kiện thông báo từ WebSocket
			socket.on("notification", data => {
					setnumberOfNotifications(data.noOfUnseen)
			});
		}
		return () => {
			// Consider adding socket.off("notification") here to prevent memory leaks
		}
	}, [socket])

	const renderNotification = (notificationObj) => { // Nhận vào một object thông báo (notificationObj) và render nó.
		const { notificationType, notificationDetail, hasRead, date, _id} = notificationObj
		switch (notificationType) { // Dựa vào notificationType để hiển thị phù hợp
			case 'question_on_product':
				return <Link key={_id} to='/' onClick={() => readNotification(_id)} className="list-group-item"> // readNotification: Hàm đánh dấu một thông báo là đã đọc.
					<div className={`row no-gutters align-items-center `}>
						<div className="col-2">
							<i className="align-middle mr-2 fas fa-fw fa-question-circle"></i>
						</div>
						<div className="col-10">
							<div className="text-dark">Asked question</div>
							<div className="text-muted small mt-1">
								<strong>{notificationDetail.questionBy} </strong>has asked a question on product <strong>{notificationDetail.onProduct}</strong></div>
							<div className="text-muted small mt-1">{moment(date).fromNow()}</div>
						</div>
					</div>
				</Link>
			default:
				return null;
		}
	}


	return ( // Hiển thị giao diện thanh thông báo
		<li className="nav-item dropdown" onClick={getNotifications}>
			<Link className="nav-icon dropdown-toggle" to=''  id="alertsDropdown" data-toggle="dropdown">
				<div className="position-relative">
					<i className="align-middle" data-feather="bell"></i>
					{numberOfNotifications>0?<span className="indicator">{numberOfNotifications}</span>:null}
				</div>
			</Link>
			<div className="dropdown-menu dropdown-menu-lg dropdown-menu-right py-0" aria-labelledby="alertsDropdown">
				<div className="list-group">
					{adminNotification.notifications.map(n => renderNotification(n))}
				</div>
				<div className="dropdown-menu-footer">
					<Link to='' className="text-muted">Show all notifications</Link> {/* You might want to make this a real link */}
				</div>
			</div>
		</li>

	)
}
NotificationBar.propTypes = {
	socket: PropTypes.object,
	getNotifications: PropTypes.func.isRequired,
	adminNotification: PropTypes.object,
	readNotification: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
	socket: state.socket,
	adminNotification: state.notification
})
export default connect(mapStateToProps, {getNotifications, readNotification})(NotificationBar)
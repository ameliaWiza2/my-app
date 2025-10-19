import { TaskNotification } from '../types/notification';
import { formatDateTime } from '../utils/formatting';

interface NotificationTrayProps {
  notifications: TaskNotification[];
}

const NotificationTray = ({ notifications }: NotificationTrayProps) => {
  return (
    <aside className="notification-tray" aria-label="Task notifications">
      <header className="notification-tray__header">
        <h3>Updates</h3>
        <span className="notification-tray__count">{notifications.length}</span>
      </header>
      <ul className="notification-tray__list">
        {notifications.length === 0 ? (
          <li className="notification-tray__empty">No updates yet</li>
        ) : (
          notifications
            .slice()
            .reverse()
            .map((notification) => (
              <li key={notification.id} className={`notification notification--${notification.type}`}>
                <p className="notification__message">{notification.message}</p>
                <time className="notification__time" dateTime={notification.timestamp}>
                  {formatDateTime(notification.timestamp)}
                </time>
              </li>
            ))
        )}
      </ul>
    </aside>
  );
};

export default NotificationTray;

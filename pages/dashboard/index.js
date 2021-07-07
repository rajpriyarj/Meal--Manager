import React, {useContext} from 'react';
import {FirebaseContext} from '../../App';
import {BackgroundWaterMark} from '../../component';
import {STUDENT, SUPER_ADMIN} from '../../utils/constants';
import ManagerDashboard from './Manager';
import StudentDashboard from './Student';
import SuperAdminDashboard from './SuperAdmin';
function Dashboard() {
  const user = useContext(FirebaseContext);
  console.log('user', user);
  return (
    <BackgroundWaterMark>
      {user.type === STUDENT ? (
        <StudentDashboard />
      ) : user.type === SUPER_ADMIN ? (
        <SuperAdminDashboard />
      ) : (
        <ManagerDashboard />
      )}
    </BackgroundWaterMark>
  );
}

export default Dashboard;

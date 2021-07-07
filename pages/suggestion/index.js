import React, {useContext} from 'react';
import {FirebaseContext} from '../../App';
import {BackgroundWaterMark} from '../../component';
import {STUDENT} from '../../utils/constants';
import ManagerSuggestion from './Manager';
import StudentSuggestion from './Student';

function Suggestion() {
  const user = useContext(FirebaseContext);
  return (
    <BackgroundWaterMark>
      {user.type === STUDENT ? <StudentSuggestion /> : <ManagerSuggestion />}
    </BackgroundWaterMark>
  );
}

export default Suggestion;

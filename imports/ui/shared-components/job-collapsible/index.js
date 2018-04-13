import { Template } from 'meteor/templating';

import '../../helpers';
import './collapsible.html';

Template.jobCollapsible.helpers({
    isHired( status ) {
        return status !== 'open';
    },
    isCompleted( status ) {
        return status === 'completed';
    },
    rightImageSrc( status ) {
        return status === 'completed'? '/img/dashboard/confirmedjob.png' : '/img/dashboard/pendingjob.png';
    }
});

import { Template } from 'meteor/templating';

import './job-history.html';

Template.JobHistory.helpers({ 
    currentJob() {
        return true;
    },
    appliedJobs() {
        return true;
    },
    completedJobs() {
        return true;
    }
});

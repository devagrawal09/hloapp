import { Template } from 'meteor/templating';

import { Jobs } from '../../../../api/jobs';
import '../../../shared-components/job-ad';
import { subscription, displayTemplate, collection, resetFilters } from '.';

export function searchForJobs() {
    subscription.set( 'jobs' );
    displayTemplate.set( 'jobAd' );
    collection.set( Jobs );
    resetFilters();
}

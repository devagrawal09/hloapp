import { Template } from 'meteor/templating';

import { Jobs } from '../../../../api/jobs';
import '../../../shared-components/job-ad';
import '../../../shared-components/job-list';
import { subscription, gridTemplate, listTemplate, collection, resetFilters } from '.';

export function searchForJobs() {
    subscription.set( 'jobs' );
    gridTemplate.set( 'jobAd' );
    listTemplate.set( 'jobList' );
    collection.set( Jobs );
    resetFilters();
}

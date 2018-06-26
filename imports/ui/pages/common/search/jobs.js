import { Template } from 'meteor/templating';

import { Jobs } from '../../../../api/jobs';
import '../../../shared-components/job-ad';
import { subscription, gridTemplate, listTemplate, collection, resetFilters } from '.';

export function searchForJobs() {
    subscription.set( 'jobs' );
    gridTemplate.set( 'jobAd' );
    listTemplate.set( 'caregiverList' );
    collection.set( Jobs );
    resetFilters();
}

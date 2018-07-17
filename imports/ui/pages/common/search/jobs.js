import { Jobs } from '../../../../api/jobs';
import '../../../shared-components/job-ad';
import '../../../shared-components/job-list';
import { 
    subscription, gridTemplate, listTemplate,
    collection, sortKeys, Sort, resetFilters, resultCount
} from '.';

export function searchForJobs() {
    subscription.set( 'jobs' );
    resultCount.set( 20 );
    gridTemplate.set( 'jobAd' );
    listTemplate.set( 'jobList' );
    collection.set( Jobs );
    sortKeys.set(['postedOn', 'title']);
    Sort.set({ postedOn: -1 });
    resetFilters();
}

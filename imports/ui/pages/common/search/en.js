import Datatypes from '../../../../api/data-types';

export const texts = {
    filters: {
        personal: {
            title: 'Personal',
            gender: {
                head: 'Gender',
                filters: [
                    { filter: 'Male', text: 'Male' },
                    { filter: 'Female', text: 'Female' }
                ]
            },
            religions: { head: 'Religion', filters: [], other: 'Other Religion' },
            languages: { head: 'Language', filters: [], other: 'Other Language' }
        },
        technical: {
            title: 'Technical',
            professional: { head: 'Professional Services', filters: [], other: 'Other Service' },
            personal: { head: 'Personal Services', filters: [], other: 'Other Service' },
            medical: { head: 'Medical Conditions', filters: [], other: 'Other Condition' }
        },
        location: {
            title: 'Location',
            locations: { head: 'Locations', filters: [], other: 'Other Location' }
        },
        time: {
            title: 'Time',
            time: { 
                head: 'Job Tenure',
                filters: [
                    { filter: 'Short term', text: 'Short-term (1 hour to 1 week)' },
                    { filter: 'Long term', text: 'Long-term (repeat business)' }
                ]
            }
        },
        price: {
            title: 'Price',
            head: 'Max Hourly Rate'
        },
        btns: {
            reset: 'Reset',
            apply: 'Apply'
        },
        search: {
            placeholder: {
                job: 'What job are you looking for?',
                caregiver: 'Who are you looking for?'
            }
        }
    },
    sortKeys: {
        name: 'Name',
        hourlyRate: 'Hourly rate',
        postedOn: 'Posted on',
        title: 'Title'
    },
    display: {
        grid: 'Grid', list: 'List'
    },
    head: 'Search Results',
    more: 'Load More'
}

const fn = val=> ({ filter: val, text: val });
texts.filters.location.locations.filters = Datatypes.Location.allowedValues.map( fn );
texts.filters.personal.religions.filters = Datatypes.Religion.allowedValues.map( fn );
texts.filters.personal.languages.filters = Datatypes.Languages.allowedValues.map( fn );
texts.filters.technical.professional.filters = Datatypes.ProfessionalService.allowedValues.map( fn );
texts.filters.technical.personal.filters = Datatypes.PersonalService.allowedValues.map( fn );
texts.filters.technical.medical.filters = Datatypes.MedicalCondition.allowedValues.map( fn );

import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'

import Datatypes from '../../../../api/data-types';

import '../../../helpers';
import '../../../shared-components/loading';
import '../../../shared-components/compose-modal';
import './filter-templates.js';
import './search.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('caregivers');
    Package['msavin:mongol'].Mongol.showCollection('jobs');
}

const setFilterDataEn = ()=> {
    const data = {};
    const fn = val=> ({ filter: val, text: val });
    data.locations = Datatypes.Location.allowedValues.map( fn );
    data.religions = Datatypes.Religion.allowedValues.map( fn );
    data.languages = Datatypes.Languages.allowedValues.map( fn );
    data.professional = Datatypes.ProfessionalService.allowedValues.map( fn );
    data.personal = Datatypes.PersonalService.allowedValues.map( fn );
    data.medical = Datatypes.MedicalCondition.allowedValues.map( fn );
    filterData.set( data );
}

export const texts = new ReactiveVar({});
export const subscription = new ReactiveVar( '' );
export const resultCount = new ReactiveVar( 20 );
export const gridTemplate = new ReactiveVar( '' );
export const listTemplate = new ReactiveVar( '' );
export const collection = new ReactiveVar();
export const Sort = new ReactiveVar({});
export const sortKeys = new ReactiveVar([]);
export const recipient = new ReactiveVar('');
export const resetFilters = ()=> {
    Filter.set({});
    $('.nav-pills ul li a.active').removeClass('active');
    $('#nameSearch').val('');
}

const Filter = new ReactiveVar({});
const gridDisplay = new ReactiveVar( true );
const filterToQuery = ( filter = {}, searchType = '' )=> {
    return Object.keys( filter ).reduce(( query, key )=> { //create query
        const val = filter[key];
        if( val.length )
        if( typeof val === 'string' ) {
            const regexSearch = { $regex: val, $options: 'i' };
            if( key === 'box' ) {
                query.$or = [
                    { name: regexSearch },
                    { location: regexSearch },
                    { otherDistrict: regexSearch }
                ]
                if( searchType === 'caregivers' ) {
                    query.$or.push(
                        { workLocation: regexSearch },
                        { otherWorkLocations: regexSearch }
                    );
                }
                if( searchType === 'jobs' ) {
                    query.$or.push({ title: regexSearch });
                }
            } else
            if( key === 'hourlyRate' ) {
                query[key] = { $lte: parseInt(val) }
            } else {
                query[key] = regexSearch;
            }
        } else if( typeof val === 'object' ) {
            query[key] = { $in: filter[key] };
        }
        return query;
    }, {});
}

Template.Search.onCreated(function() {
    this.autorun(()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`./tc.js`).then( i => {
                texts.set( i.texts );
            });
        else
            import(`./en.js`).then( i => {
                texts.set( i.texts );
                setFilterDataEn();
            });
    });
    this.autorun(()=> {
        let subs = subscription.get();
        let filter = filterToQuery( Filter.get(), subs );
        let sort = Sort.get();
        let limit = resultCount.get();
        this.subscribe( subs, { filter, sort, limit });
        console.log({ filter });
    });
});

Template.Search.onRendered(function() {
    this.$('#slider').slider({
        min: 0,
        max: 500
    });
});

Template.Search.helpers({
    texts() {
        return texts.get();
    },
    docs() {
        let coll = collection.get();
        let sort = Sort.get();
        return coll.find( {}, { sort });
    },
    display() {
        return {
            grid: gridTemplate.get(),
            list: listTemplate.get()
        }
    },
    isGrid() {
        return gridDisplay.get();
    },
    placeholder( obj ) {
        let search = subscription.get();
        if( search === 'jobs' )
            return obj.job;
        return obj.caregiver;
    },
    isJobSearch() {
        let search = subscription.get();
        return search === 'jobs';
    },
    isOtherField( field ) {
        return field === 'Other';
    },
    initiateSlider() {
        $('#slider').slider({
            min: 0,
            max: 500
        });
        return '';
    },
    msgDoc() {
        return { recipient: recipient.get() };
    }
});

Template.Search.events({
    'click .dropdown-menu a'( e, t ) {
        e.preventDefault();
        e.stopPropagation();
        t.$( e.target ).toggleClass( 'active' );
    },
    'click .display-grid'() { 
        gridDisplay.set( true );
    },
    'click .display-list'() {
        gridDisplay.set( false );
    },
    'keypress #nameSearch'( e, t ) {
        if( e.which === 13 ) {
            let newFilter = Filter.get();
            newFilter.box = e.target.value;
            Filter.set(newFilter);
        }
    },
    'click .search-icon'( e, t ) {
        let newFilter = Filter.get();
        newFilter.box = t.$('#nameSearch').val();
        Filter.set(newFilter);
    },
    'click #location-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.location = '';
            t.$('#location-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }
        
        newFilter.location = t.$('#location-filter li a.active').get().map( el=> el.getAttribute('data-filter') );
        newFilter.otherDistrict = t.$('#location-filter input').val();

        Filter.set(newFilter);
        
    },
    'click #personal-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.gender = newFilter.religion = newFilter.languages = '';
            t.$('#personal-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }

        newFilter.gender = t.$('#personal-filter li a.active.gender').get().map( el=> el.getAttribute('data-filter') );
        newFilter.religion = t.$('#personal-filter li a.active.religion').get().map( el=> el.getAttribute('data-filter') );
        newFilter.languages = t.$('#personal-filter li a.active.language').get().map( el=> el.getAttribute('data-filter') );        
        newFilter.otherReligion = t.$('#personal-filter #otherReligion').val();
        newFilter.otherLanguages = t.$('#personal-filter #otherLanguage').val();
        Filter.set( newFilter );
    },
    'click #technical-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.professionalServices = 
            newFilter.personalServices = 
            newFilter.medicalConditions = '';
            t.$('#technical-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }
        
        newFilter.professionalServices = t.$('#technical-filter li a.active.professional').get().map( el=> el.getAttribute('data-filter') );
        newFilter.personalServices = t.$('#technical-filter li a.active.personal').get().map( el=> el.getAttribute('data-filter') );
        newFilter.medicalConditions = t.$('#technical-filter li a.active.medical').get().map( el=> el.getAttribute('data-filter') );        
        newFilter.otherProfessionalService = t.$('#technical-filter #otherProfessional').val();        
        newFilter.otherPersonalService = t.$('#technical-filter #otherPersonal').val();
        newFilter.otherMedicalCondition = t.$('#technical-filter #otherMedical').val();
        
        Filter.set(newFilter);
    },
    'click #time-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.duration = '';
            t.$('#time-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }

        newFilter.duration = t.$('#time-filter li a.active').get().map( el=> el.dataset.value );

        Filter.set(newFilter);
    },
    'click #price-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.hourlyRate = '';
            return Filter.set(newFilter);
        }

        newFilter.hourlyRate = t.$('#price-filter #slider').val();
        
        Filter.set(newFilter);
    },
    'click .load-more'() {
        resultCount.set( resultCount.get() + 20 );
    },
    'click .grid-toggle'() { gridDisplay.set( true ); },
    'click .list-toggle'() { gridDisplay.set( false ); }
});

Template.sortButtons.helpers({
    sortKeys() {
        return sortKeys.get();
    }
});

Template.sortButton.helpers({
    arrowDir() {
        const order = Sort.get()[this.key];
        if( order === 1 ) return 'down';
        if( order === -1 ) return 'up';
    },
    text( key ) {
        return texts.get().sortKeys[ key ];
    }
});

Template.sortButton.events({
    'click .btn'( e , t ) {
        const key = t.data.key;
        const currentSort = Sort.get();
        const newSort = {};
        if( currentSort[key] === 1 ) newSort[key] = -1;
        else newSort[key] = 1;
        Sort.set(newSort);
    }
});

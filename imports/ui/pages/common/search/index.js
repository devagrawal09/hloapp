import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import SimpleSchema from 'simpl-schema';
import { ReactiveVar } from 'meteor/reactive-var'

import Datatypes from '../../../../api/data-types';

import '../../../helpers';
import './filter-templates.js';
import './search.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('caregivers');
    Package['msavin:mongol'].Mongol.showCollection('jobs');
}

const filterData = {
    locations: Datatypes.Location.allowedValues,
    religions: Datatypes.Religion.allowedValues,
    languages: Datatypes.Languages.allowedValues,
    professional: Datatypes.ProfessionalService.allowedValues,
    personal: Datatypes.PersonalService.allowedValues,
    medical: Datatypes.MedicalCondition.allowedValues
};

const Filter = new ReactiveVar({});
const gridDisplay = new ReactiveVar( true );
export const subscription = new ReactiveVar( '' );
export const displayTemplate = new ReactiveVar( '' );
export const collection = new ReactiveVar();
export const resetFilters = ()=> {
    Filter.set({});
    $('.nav-pills ul li a.active').removeClass('active');
    $('#nameSearch').val('');
}

Template.Search.onCreated(function() {
    this.autorun(()=> {
        let subs = subscription.get();
        console.log( subs );
        this.subscribe( subs );
    });
});

Template.Search.onRendered(function() {
    this.$('#slider').slider({
        min: 0,
        max: 500
    });
});

Template.Search.helpers({
    docs() {
        let filter = Filter.get();
        let coll = collection.get();
        let searchType = subscription.get();

        let Query = Object.keys( filter ).reduce(( query, key )=> { //create query
            
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

        console.log( Query );
        return coll.find( Query );
    },
    displayTemplate() {
        return displayTemplate.get();
    },
    isGrid() {
        return gridDisplay.get();
    },
    placeholder() {
        let search = subscription.get();
        if( search === 'jobs' ) {
            return 'What job are you looking for?'
        }
        return 'Who are you looking for?';
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
        console.log('initiateSlider');
        return '';
    },
    filterData
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
        
        newFilter.location = t.$('#location-filter li a.active').get().map( el=> el.innerText );
        newFilter.otherDistrict = t.$('#location-filter input').val();

        Filter.set(newFilter);
        console.log(newFilter);
        
    },
    'click #personal-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.gender = newFilter.religion = newFilter.language = '';
            t.$('#location-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }

        newFilter.gender = t.$('#personal-filter li a.active.gender').get().map( el=> el.innerText );
        newFilter.religion = t.$('#personal-filter li a.active.religion').get().map( el=> el.innerText );
        newFilter.language = t.$('#personal-filter li a.active.language').get().map( el=> el.innerText );        
        newFilter.otherReligion = t.$('#personal-filter #otherReligion').val();
        newFilter.otherLanguage = t.$('#personal-filter #otherLanguage').val();
        
        Filter.set(newFilter);
        console.log(newFilter);
    },
    'click #technical-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.professionalServices = 
            newFilter.personalServices = 
            newFilter.medicalConditions = '';
            t.$('#location-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }
        
        newFilter.professionalServices = t.$('#technical-filter li a.active.professional').get().map( el=> el.innerText );
        newFilter.personalServices = t.$('#technical-filter li a.active.personal').get().map( el=> el.innerText );
        newFilter.medicalConditions = t.$('#technical-filter li a.active.medical').get().map( el=> el.innerText );        
        newFilter.otherProfessionalService = t.$('#technical-filter #otherProfessional').val();        
        newFilter.otherPersonalService = t.$('#technical-filter #otherPersonal').val();
        newFilter.otherMedicalCondition = t.$('#technical-filter #otherMedical').val();
        
        Filter.set(newFilter);
        console.log(newFilter);
    },
    'click #time-filter .btn'( e, t ) {

        let newFilter = Filter.get();

        if( t.$( e.target ).hasClass('pull-left') ) {
            //reset button
            newFilter.duration = '';
            t.$('#location-filter li a.active').removeClass('active');
            return Filter.set(newFilter);
        }

        newFilter.duration = t.$('#time-filter li a.active').get().map( el=> el.dataset.value );

        Filter.set(newFilter);
        console.log(newFilter);
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
        console.log(newFilter);
    }
});

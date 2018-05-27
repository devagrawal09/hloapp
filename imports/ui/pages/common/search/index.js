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

const filterSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Search from name'
    },
    gender: Datatypes.Gender,
    location: Array,
    'location.$': Datatypes.Location,
    caregiverType: Array,
    'caregiverType.$': Datatypes.CaregiverType,
    medicalConditions: Array,
    'medicalConditions.$': Datatypes.MedicalCondition,
    professionalServices: Array,
    'professionalServices.$': Datatypes.ProfessionalService,
    personalServices: Array,
    'personalServices.$': Datatypes.PersonalService,
    languages: Array,
    'languages.$': Datatypes.Languages
}, { requiredByDefault: false });

const Filter = new ReactiveVar({});
const gridDisplay = new ReactiveVar( true );
export const subscription = new ReactiveVar( '' );
export const displayTemplate = new ReactiveVar( '' );
export const collection = new ReactiveVar();

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
    filterSchema() {
        return filterSchema;
    },
    filterDoc() {
        return Filter.get();
    },
    docs() {
        let filter = Filter.get();
        let coll = collection.get();
        console.log( coll );

        let Query = Object.keys( filter ).reduce(( query, key )=> { //create query
            if( key === 'name' ) {
                query.fullName = { $regex: filter[key], $options: 'i' };
                return query;
            }
            if( key === 'gender' ) {
                query.gender = filter[key];
                return query;
            }
            query[key] = { $all: filter[key] };
            return query;
        }, {});

        console.log( Query );
        console.log( this );
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
    }
});

AutoForm.hooks({
    searchFilter: {
        onSubmit( doc ) {
            this.done( null, doc );
            return false;
        },
        onSuccess( formType, doc ) {
            let cleanDoc = filterSchema.clean( doc );
            Filter.set( doc );
        }
    }
});

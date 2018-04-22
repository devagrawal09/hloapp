import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import SimpleSchema from 'simpl-schema';
import { ReactiveVar } from 'meteor/reactive-var'

import Datatypes from '../../../../api/data-types';
import { Caregivers } from '../../../../api/caregivers';
import { Jobs } from '../../../../api/jobs';

import '../../../helpers';
import './filter-templates.js';
import './search.html';

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
const displayType = new ReactiveVar('grid');

Template.Search.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        let search = Template.currentData().search();
        if( search === 'caregivers' ) {
            t.subscribe( 'caregivers' );
        } else if( search === 'jobs' ) {
            t.subscribe( 'jobs' );
        }
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
        let search = Template.currentData().search();
        let filter = Filter.get();

        let Query = Object.keys( filter ).reduce(( query, key )=> {     //create query
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

        console.log(Query);
        if( search === 'caregivers' ) {
            return Caregivers.find( Query );
        }
        if( search === 'jobs' ) {
            return Jobs.find( Query );
        }
    },
    display() {
        let display = {};
        display.type = displayType.get();
        display.search = Template.currentData().search();
        return display;
    }
});

Template.Search.events({ 
    'click .display-grid'() { 
        displayType.set( 'grid' );
    },
    'click .display-list'() {
        displayType.set( 'list' );
    }
});

AutoForm.hooks({
    searchFilter: {
        onSubmit( doc ) {
            let cleanDoc = filterSchema.clean( doc );
            Filter.set( doc );
            this.done();
            return false;
        }
    }
});

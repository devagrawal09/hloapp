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

Template.Search.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        if( t.data.search === 'caregivers' ) {
            t.subscribe( 'caregivers' );
        } else if( t.data.search === 'jobs' ) {
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
        let t = Template.instance();
        let filter = Filter.get();
        let query = {
            fullName: {
                $regex: filter.name,
                $options: 'i'
            },
            gender: filter.gender,
            district: { $all: location },
            caregiverType: { $all: caregiverType },
            professionalServices: { $all: professionalServices },
            personalServices: { $all: personalServices },
            languages: { $all: languages },
            medicalExpertise: { $all: medicalConditions }
        };
        if( t.data.search === 'caregivers' ) {
            return Caregivers.find( query );
        }
        if( t.data.search === 'jobs' ) {
            return Jobs.find( query );
        }
    },
    template() {
        let t = Template.instance();
        if( t.data.search === 'caregivers' ) {
            return 'caregiverCard';
        }
        if( t.data.search === 'jobs' ) {
            return 'jobAd';
        }
    }
});

AutoForm.hooks({
    searchFilter: {
        onSubmit( doc ) {
            console.log( doc );
            Filter.set( doc );
            this.done();
            return false;
        }
    }
});

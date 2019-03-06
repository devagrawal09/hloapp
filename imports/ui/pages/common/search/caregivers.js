import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import SimpleSchema from 'simpl-schema';

import Datatypes from '../../../../api/data-types';

import { Caregivers } from '../../../../api/caregivers';
import '../../../shared-components/caregiver-card';
import '../../../shared-components/caregiver-list';
import './slider/css/slider.css';
import './slider/js/bootstrap-slider.js';
import './autofilter.html';
import { 
    subscription, gridTemplate, listTemplate, Filter,
    collection, sortKeys, Sort, resetFilters, resultCount
} from '.';

const autoSchema = new SimpleSchema({
    duration: {
        type: String,
        allowedValues: ['Short term', 'Long term']
    },
    location: Array,
    'location.$': Datatypes.Location,
    caregiverType: Array,
    'caregiverType.$': Datatypes.CaregiverType,
    professionalServices: Array,
    'professionalServices.$': Datatypes.ProfessionalService,
    personalServices: Array,
    'personalServices.$': Datatypes.PersonalService,
    medicalConditions: Array,
    'medicalConditions.$': Datatypes.MedicalCondition,
    hourlyRate: Number
});

export function searchForCaregivers() {
    subscription.set( 'caregivers.cards' );
    resultCount.set( 20 );
    gridTemplate.set( 'caregiverCard' );
    listTemplate.set( 'caregiverList' );
    collection.set( Caregivers );
    sortKeys.set(['name', 'hourlyRate']);
    Sort.set({ name: 1 });
    resetFilters();
    $('#slider').slider({
        min: 0,
        max: 500
    });
}

Template.autofilter.onRendered(function() {
    
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    
    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);
    
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);
    });
    $(".prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);
    });

    function nextTab(elem) {
        $(elem).next().find('a[data-toggle="tab"]').click();
    }
    function prevTab(elem) {
        $(elem).prev().find('a[data-toggle="tab"]').click();
    }

    this.$('#autoslider').slider({
        min: 0,
        max: 500
    });
});

Template.autofilter.helpers({
    autoSchema
});

Template.autofilter.events({
    'click .af-toggle'() {
        $('#autofilter').modal();
    },
    'click .submit'( e, t ) {
        const filter = AutoForm.getFormValues('autoFilter', '', autoSchema, false );
        filter.hourlyRate = t.$('#autoslider').val();
        console.log({ filter });
        Filter.set( filter );
        resultCount.set( 5 );
    },
    'click .reset'() {
        AutoForm.resetForm('autoFilter');
    }
});

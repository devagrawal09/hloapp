import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './forms.js';
import './review.js';

import './edit-profile.html';

Template.EditProfileCaregiver.onCreated(function() {
    let t = this;
    t.state = new ReactiveVar(0);
    t.templates = [
        'detailsForm', 'experienceForm', 'servicesForm',
        'photosForm', 'pricingForm', 'profileReview'
    ];
    t.next = ()=> {
        let currentState = t.state.get();
        if ( currentState === 5 ) return ;
        t.state.set( currentState + 1 );
    }
    t.prev = ()=> {
        let currentState = t.state.get();
        if ( currentState === 0 ) return;
        t.state.set( currentState - 1 );
    }
});

Template.EditProfileCaregiver.helpers({
    display() {
        let t = Template.instance();
        return t.templates[ t.state.get() ];
    }
});

Template.EditProfileCaregiver.events({
    'click .nav a'( e, t ) {
        t.$( 'li.active' ).removeClass( 'active' );
        let $target = $( e.target );
        let newState = parseInt( $target.attr( 'href' ).substr( 1 ) );
        t.state.set( newState )
        $target.parent().addClass( 'active' );
    },
    'click .next'( e, t ) {
        t.$( 'li.active' ).removeClass( 'active' );
        t.next();
        let newState = t.state.get();
        let selector = `.nav a[href="#${newState}"]`;
        console.log(selector);
        let $target = $( selector );
        $target.parent().addClass( 'active' );
    },
    'click .back'( e, t ) {
        t.$( 'li.active' ).removeClass( 'active' );
        t.prev();
        let newState = t.state.get();
        let selector = `.nav a[href="#${newState}"]`;
        console.log(selector);
        let $target = $( selector );
        $target.parent().addClass( 'active' );
    }
});

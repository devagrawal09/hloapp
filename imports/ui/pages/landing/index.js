import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Jobs } from '../../../api/jobs';
import { Caregivers } from '../../../api/caregivers';

import '../../helpers';
import '../../shared-components/loading';
import '../../shared-components/job-ad';
import '../../shared-components/caregiver-card';

import './slick/slick.css';
import './slick/slick-theme.css';
import './landing.html';

const slickLoaded = new ReactiveVar( false );
const texts = new ReactiveVar({});

Template.Landing.onCreated(function () {
    this.subscribe('featured');
    this.subscribe('professional');
    this.autorun( ()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`./tc.js`).then( i => {
                texts.set( i.texts );
            });
        else
            import(`./en.js`).then( i => {
                texts.set( i.texts );
            });
    });
});

Template.Landing.onRendered(function () {
    $.getScript('/js/slick.min.js', () => {
        slickLoaded.set( true );
        this.$('.caregiver-types .carousel').slick({
            autoplay: true,
            autoplaySpeed: 5000,
            centerMode: true,
            centerPadding: '100px',
            dots: true,
            slidesToShow: 3,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '40px',
                        slidesToShow: 1
                    }
                }
            ]
        });
    });
});

Template.Landing.helpers({
    texts() {
        return texts.get();
    },
    featured() {
        return Jobs.find({
            status: 'open',
            featured: true
        }).fetch();
    },
    professional() {
        return Caregivers.find({
            isProfileComplete: true,
            professional: true
        }).fetch();
    }
});

Template.cardCarousel.onRendered(function() {
    this.autorun(()=> {
        if( slickLoaded.get() ) {
            this.$('.ad-container, .card-container').removeClass('col-md-3 col-sm-6');
            this.$('.carousel').slick({
                autoplay: true,
                autoplaySpeed: 5000,
                infinite: true,
                slidesToShow: 4,
                responsive: [{
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                },{
                    breakpoint: 450,
                    settings: {
                        slidesToShow: 1
                    }
                }]
            });
        }
    });
});

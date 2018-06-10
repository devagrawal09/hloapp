import { Template } from 'meteor/templating';

import { Jobs } from '../../../api/jobs';
import { Caregivers } from '../../../api/caregivers';

import '../../helpers';
import '../../shared-components/job-ad';
import '../../shared-components/caregiver-card';

import './slick/slick.css';
import './slick/slick-theme.css';
import './landing.html';

Template.Landing.onCreated(function () {
    this.subscribe('jobs');
    this.subscribe('caregivers');    
});

Template.Landing.onRendered(function () {
    $.getScript('/js/slick.min.js', () => {
        this.$('.caregiver-types .carousel').slick({
            autoplay: true,
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
    caregiverTypes: [
        {
            title: 'Home Nurse Care',
            content: `
                Very experienced with strong technical skills,
                many have worked as family Caregivers.
                Housewives and other seniors that truly understand the meaning of
                Tender Loving Care.
            `
        }, {
            title: 'Nursing Students Care',
            content: `
                University students studying to become a licensed nurse.
                Very passionate to help other people and start using their technical skills.
            `
        }, {
            title: 'Volunteer Care',
            content: `
                People with super big hearts that is willing to be of service at no charge.
                Real Social Heroes.
            `
        }, {
            title: 'Licensed Nurse Care',
            content: `
                Registered or Enroll Nurses. Very experienced with strong technical skills,
                ideal for patients with long-term medical conditions.
            `
        }, {
            title: 'Eldercare',
            content: `
                People with experience looking after seniors.
                Many are other seniors who can empathize with your Loved Ones.
            `
        }, {
            title: 'Special Needs Care',
            content: `
                Be it autism, mental or physically challenged.
                Find Caregivers who have the experience, empathy, and compassion to help.
            `
        }, {
            title: 'Specialist Care',
            content: `
                There are so many different types of specialists and therapists
                (alternative, holistic and wellness). Find professional, licensed,
                knowledgeable, and friendly specialists to help.
            `
        }, {
            title: 'Expert Care',
            content: `
                There are so many different types of experts
                (personal trainers, life coaches, consultants, counselors, and many, many more).
            `
        }, {
            title: 'TLC Care',
            content: `
                Experts at caring for people with colds and flus.
            `
        }, {
            title: 'Everyday Care',
            content: `
                Sunday’s can be every day. Maybe your maid is on holiday or sick.
                Sometimes it’s nice to have a trusted, professional,
                and friendly neighbor to help out.
            `
        }, {
            title: 'Lastminute Care',
            content: `
                Normally means same day service.
            `
        }, {
            title: 'Sports Buddies Care',
            content: `
                Many sports requires a partner. It helps to motivate and inspire people
                to take action and walk the talk.
            `
        }
    ],
    featured() {
        return Jobs.find({});
    },
    professional() {
        return Caregivers.find({});
    }
});

Template.cardCarousel.onRendered(function() {
    
    this.$('.ad-container, .card-container').removeClass('col-md-3 col-sm-6');
    this.$('.carousel').slick({
        infinite: true,
        slidesToShow: 4
    });
});

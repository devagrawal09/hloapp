//import libraries
    import { FlowRouter } from 'meteor/kadira:flow-router';
    import { BlazeLayout } from 'meteor/kadira:blaze-layout';

//import partials
    import '../../ui/partials';

//import layouts
    import '../../ui/layouts/app-layout';

//landing page
    FlowRouter.route('/', {
        name: 'landing',
        action() {
            import('../../ui/pages/landing').then(function() {
                BlazeLayout.render('AppLayout', { main: 'Landing' });
            });
        }
    });

//misc pages
    FlowRouter.route('/community', {
        name: 'community',
        action() {
            import('../../ui/pages/misc/community').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Community' });
            });
        }
    });
    
    FlowRouter.route('/contact', {
        name: 'contact',
        action() {
            import('../../ui/pages/misc/contact').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Contact' });
            });
        }
    });
    
    FlowRouter.route('/faq', {
        name: 'faq',
        action() {
            import('../../ui/pages/misc/faq').then(function(){
                BlazeLayout.render('AppLayout', { main: 'FAQ' });
            });
        }
    });
    
    FlowRouter.route('/privacy', {
        name: 'privacy',
        action() {
            import('../../ui/pages/misc/privacy').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Privacy' });
            });
        }
    });
    
    FlowRouter.route('/terms', {
        name: 'terms',
        action() {
            import('../../ui/pages/misc/terms').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Terms' });
            });
        }
    });
    
    FlowRouter.route('/about', {
        name: 'about',
        action() {
            import('../../ui/pages/misc/about').then(function(){
                BlazeLayout.render('AppLayout', { main: 'About' });
            });
        }
    });
    
//404 page
    FlowRouter.notFound = {
        action() {
            alert('This page is under maintainence. Please try later.');
        }
    }
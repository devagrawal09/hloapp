//import libraries
    import { Meteor } from 'meteor/meteor';
    import { Accounts } from 'meteor/accounts-base';
    import { FlowRouter } from 'meteor/kadira:flow-router';
    import { BlazeLayout } from 'meteor/kadira:blaze-layout';
    import { AccountsTemplates } from 'meteor/useraccounts:core';

//import partials
    import '../../ui/partials';

//import layouts
    import '../../ui/layouts/app-layout';
    import '../../ui/layouts/login-layout';

//import dashboard layout on login
    Accounts.onLogin(()=> {     //on successful login attempt
        import('../../ui/layouts/dashboard-layout').then(function(){
            FlowRouter.go('dashboard');
        });
    });

    Meteor.startup(()=> {       //if user is already logged in
        if ( Meteor.userId() ) {
            import('../../ui/layouts/dashboard-layout').then(function(){
                let currentPath = FlowRouter.current().path;    //reload current page
                FlowRouter.go(currentPath);
            });
        }
    });

//route groups
    const PrivateRouter = FlowRouter.group({
        triggersEnter: [AccountsTemplates.ensureSignedIn]
    });

    const CustomerRouter = PrivateRouter.group({
        triggersEnter: [function( con, redirect ) {
            if ( Meteor.user().type !== 'customer' ) {
                redirect('/dashboard');
            }
        }]
    });

    const CaregiverRouter = PrivateRouter.group({
        triggersEnter: [function( con, redirect ) {
            if ( Meteor.user().type !== 'caregiver' ) {
                redirect('/dashboard');
            }
        }]
    });

//landing page
    FlowRouter.route('/', {
        name: 'landing',
        triggersEnter: [function( con, redirect ) {
            if ( Meteor.userId() ) {
                redirect('/dashboard');
            }
        }],
        action() {
            import('../../ui/pages/landing').then(function() {
                BlazeLayout.render('AppLayout', { main: 'Landing' });
            });
        }
    });

//accounts pages
    FlowRouter.route('/account', {
        name: 'landing',
        action() {
            import ('../../ui/pages/account').then(function() {
                BlazeLayout.render('Account');
            });
        }
    });
    /*    
        FlowRouter.route('/login', {
            name: 'login',
            action() {
                import ('../../ui/pages/account').then(function() {
                    BlazeLayout.render('LoginLayout', { main: 'Login' });
                });
            }
        });
        FlowRouter.route('/signup', {
            name: 'signup',
            action() {
                import ('../../ui/pages/account').then(function() {
                    BlazeLayout.render('LoginLayout', { main: 'Signup' });
                });
            }
        });
    */

    AccountsTemplates.configureRoute('signIn', {
        name: 'login',
        path: '/login',
        layoutTemplate: 'LoginLayout',
        template: 'atForm',
        contentRegion: 'main',
        redirect: '/'
    });
    AccountsTemplates.configureRoute('signUp', {
        name: 'signup',
        path: '/signup',
        layoutTemplate: 'LoginLayout',
        template: 'atForm',
        contentRegion: 'main',
        redirect: '/'
    }); 

//dashboard
    PrivateRouter.route('/dashboard', {
        name: 'dashboard',
        action() {
            BlazeLayout.render('AppLayout', {
                main: 'DashboardLayout',
                    
            });
        }
    });

//messaging pages
    PrivateRouter.route('/chat', {
        name: 'chat',
        action() {
            BlazeLayout.render('AppLayout', {
                main: 'DashboardLayout',
                    
            });
        }
    });
    
    PrivateRouter.route('/chat/:id', {
        name: 'conversation',
        action( params ) {
            BlazeLayout.render('AppLayout', {
                main: 'DashboardLayout',
                conversation: params.id
            });
        }
    });

//settings page
    PrivateRouter.route('/settings', {
        name: 'settings',
        action() {
            BlazeLayout.render('AppLayout', {
                main: 'DashboardLayout',
                
            });
        }
    });

//caregiver routes

//customer routes

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
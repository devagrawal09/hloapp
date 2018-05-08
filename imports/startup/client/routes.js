//import libraries
    import { Meteor } from 'meteor/meteor';
    import { Accounts } from 'meteor/accounts-base';
    import { FlowRouter } from 'meteor/kadira:flow-router';
    import { BlazeLayout } from 'meteor/kadira:blaze-layout';
    import { AccountsTemplates } from 'meteor/useraccounts:core';

//import partials
    import '../../ui/partials';

//import methods
    import '../../api/users';
    import { commonRoutesAction, showLoader } from './boilerplates';

//import layouts
    import '../../ui/layouts/app-layout';
    import '../../ui/layouts/login-layout';

//login and logout hooks

    let handle;

    Accounts.onLogin(()=> {     //on successful login attempt
        handle = Meteor.subscribe( 'user.profile' );
        import('../../ui/layouts/dashboard-layout');
    });

    Accounts.onLogout(()=> {    //on successful logout attempt
        handle.stop();
    });

//route groups
    const PrivateRouter = FlowRouter.group({
        triggersEnter: [AccountsTemplates.ensureSignedIn]
    });

    const PublicOnlyRouter = FlowRouter.group({
        triggersEnter: [function( con, redirect ) {
            if( Meteor.userId() ) redirect('/dashboard');
        }]
    });

    const CustomerRouter = PrivateRouter.group({
        triggersEnter: [function( con, redirect ) {
            if ( Meteor.user().profile.type !== 'customer' ) {
                console.log( 'You are not a customer' );
                redirect('/dashboard');
            }
        }]
    });

    const CaregiverRouter = PrivateRouter.group({
        triggersEnter: [function( con, redirect ) {
            if ( Meteor.user().profile.type !== 'caregiver' ) {
                console.log( 'You are not a caregiver' );
                redirect('/dashboard');
            }
        }]
    });

//landing page
    FlowRouter.route('/', {
        name: 'landing',
        action() {
            import('../../ui/pages/landing').then(function() {
                BlazeLayout.render('AppLayout', { main: 'Landing' });
            });
        }
    });

//accounts pages
    PublicOnlyRouter.route('/account', {
        name: 'account',
        action() {
            import ('../../ui/pages/account').then(function() {
                BlazeLayout.render('Account');
            });
        }
    });

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

    PublicOnlyRouter.route('/logged-out', {
        name: 'logged-out',
        action() {
            //logout page render
            import('../../ui/pages/logged-out').then(()=> {
                BlazeLayout.render('LoginLayout', { main: 'LoggedOut' });
            });
        }
    });

//dashboard
    PrivateRouter.route('/dashboard', {
        name: 'dashboard',
        action() {
            showLoader();
            commonRoutesAction({ caregiver: {
                import() { return import('../../ui/pages/caregiver/dashboard') },
                render: {
                    main: 'DashboardLayout',
                    content: 'JobHistory'
                }
            }, customer: {
                import() { return import('../../ui/pages/customer/dashboard') },
                render: {
                    main: 'DashboardLayout',
                    content: 'PostedJobs'
                }
            }});
        }
    });

//messaging pages
    PrivateRouter.route('/chat', {
        name: 'chat',
        action() {
            showLoader();
            // BlazeLayout.render('AppLayout', {
            //     main: 'DashboardLayout',
                    
            // });
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

//profile edit page
    PrivateRouter.route('/profile', {
        name: 'profile.edit',
        action() {
            showLoader('DashboardLayout');
            commonRoutesAction({ caregiver: {
                import() { return import('../../ui/pages/caregiver/edit-profile') },
                render: {
                    main: 'DashboardLayout',
                    content: 'EditProfileCaregiver'
                }
            }, customer: {
                import() { return import('../../ui/pages/customer/edit-profile') },
                render: {
                    main: 'DashboardLayout',
                    content: 'EditProfileCustomer'
                }
            }});
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

//search routes
    FlowRouter.route('/caregivers', {
        name: 'caregivers.search',
        action() {
            import('../../ui/pages/common/search/caregivers.js').then(( imports )=> {
                BlazeLayout.render('AppLayout', { main: 'Search' });
                imports.searchForCaregivers();
            });
        }
    });

    FlowRouter.route('/caregiver/:id', {
        name: 'caregiver.profile',
        action( params ) {
            import('../../ui/pages/common/caregiver-profile').then(()=> {
                BlazeLayout.render('AppLayout', {
                    main: 'CaregiverProfile',
                    id: params.id
                });
            });
        }
    });

    FlowRouter.route('/jobs', {
        name: 'jobs.search',
        action() {
            import('../../ui/pages/common/search/jobs.js').then(( imports )=> {
                BlazeLayout.render('AppLayout', { main: 'Search' });
                imports.searchForJobs();
            });
        }
    });

//caregiver routes
//customer routes
    CustomerRouter.route('/jobs/new', {
        name: 'jobs.new',
        action() {
            import('../../ui/pages/customer/post-job').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'PostJob'
                });
            });
        }
    });

    CustomerRouter.route('/edit/:id', {
        name: 'job.edit',
        action( params ) {
            import('../../ui/pages/customer/edit-job').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'EditJob',
                    id: params.id
                });
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

    AutoForm.debug();
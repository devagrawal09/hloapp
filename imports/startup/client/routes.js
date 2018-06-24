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
    import UI from './ui';

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
        triggersEnter: [AccountsTemplates.ensureSignedIn, function() {
            Meteor.call('user.getType', ( err, res )=> {
                if ( !res ) FlowRouter.go('pick-type');
            })
        }]
    });

    const PublicOnlyRouter = FlowRouter.group({
        triggersEnter: [function( con, redirect ) {
            if( Meteor.userId() ) redirect('/dashboard');
        }]
    });

    const CustomerRouter = PrivateRouter.group({
        triggersEnter: [function() {

            Meteor.call('user.getType', ( err, res )=> {
                if ( res !== 'customer' ) {
                    console.log( 'You are not a customer' );
                    FlowRouter.go('dashboard');
                }
            })
        }]
    });

    const CaregiverRouter = PrivateRouter.group({
        triggersEnter: [function() {
            
            Meteor.call('user.getType', ( err, res )=> {
                if ( res !== 'caregiver' ) {
                    console.log( 'You are not a caregiver' );
                    FlowRouter.go('dashboard');
                }
            })
        }]
    });

//landing page
    FlowRouter.route('/', {
        name: 'landing',
        action() {
            import('../../ui/pages/landing').then(()=> {
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
        redirect: '/dashboard'
    });
    AccountsTemplates.configureRoute('signUp', {
        name: 'signup',
        path: '/signup',
        layoutTemplate: 'LoginLayout',
        template: 'atForm',
        contentRegion: 'main',
        redirect: '/dashboard'
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

    FlowRouter.route('/pick', {
        name: 'pick-type',
        triggersEnter: [AccountsTemplates.ensureSignedIn],
        action() {
            import('../../ui/pages/pick-type').then(()=> {
                BlazeLayout.render('LoginLayout', { main: 'pickTypeForm' });
            });
        }
    });

//dashboard
    PrivateRouter.route('/dashboard', {
        name: 'dashboard',
        action() {
            UI.showLoader();
            UI.commonRoutesAction({ caregiver: {
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

//bookmarks page
    PrivateRouter.route('/favorites', {
        name: 'favorites',
        action() {
            import('../../ui/pages/common/bookmarks').then(()=> {
                BlazeLayout.render('AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Bookmarks'
                });
            });
        }
    });

//messaging pages
    PrivateRouter.route('/chat', {
        name: 'chat',
        action() {
            UI.showLoader();
            import('../../ui/pages/common/chat/chat').then(()=> {
                BlazeLayout.render('AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Chat'
                });
            });
        }
    });
    
    PrivateRouter.route('/chat/:id', {
        name: 'conversation',
        action( params ) {
            import('../../ui/pages/common/chat/conversation').then(()=> {
                BlazeLayout.render('AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Conversation',
                    conversation: params.id
                });
            });
        }
    });

//profile edit page
    PrivateRouter.route('/profile', {
        name: 'profile.edit',
        action() {
            UI.showLoader('DashboardLayout');
            UI.commonRoutesAction({ caregiver: {
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

//settings pages
    PrivateRouter.route('/settings', {
        name: 'settings',
        action() {
            import('../../ui/pages/common/settings').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Settings'
                });
            });
        }
    });

    PrivateRouter.route('/settings/username', {
        name: 'settings.username',
        action() {
            import('../../ui/pages/common/settings').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Settings',
                    settings: 'usernameSettings'
                });
            });
        }
    });

    PrivateRouter.route('/settings/emails', {
        name: 'settings.emails',
        action() {
            import('../../ui/pages/common/settings').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Settings',
                    settings: 'emailSettings'
                });
            });
        }
    });

    PrivateRouter.route('/settings/passwords', {
        name: 'settings.passwords',
        action() {
            import('../../ui/pages/common/settings').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Settings',
                    settings: 'passwordSettings'
                });
            });
        }
    });

    PrivateRouter.route('/settings/payment', {
        name: 'settings.payment',
        action() {
            import('../../ui/pages/common/settings').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Settings',
                    settings: 'paymentSettings'
                });
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

    FlowRouter.route('/job/:id', {
        name: 'job.details',
        action( params ) {
            import('../../ui/pages/common/job-details').then(()=> {
                BlazeLayout.render('AppLayout', {
                    main: 'JobDetails',
                    id: params.id
                });
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
    

    AutoForm.debug();
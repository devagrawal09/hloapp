//import libraries
    import { Meteor } from 'meteor/meteor';
    import { Session } from 'meteor/session';
    import { Accounts } from 'meteor/accounts-base';
    import { analytics } from 'meteor/okgrow:analytics';
    import { FlowRouter } from 'meteor/kadira:flow-router';
    import { BlazeLayout } from 'meteor/kadira:blaze-layout';
    import { AccountsTemplates } from 'meteor/useraccounts:core';
    import { FlowRouterTitle } from 'meteor/ostrio:flow-router-title';

//import partials
    import '../../ui/partials';

//import methods
    import '../../api/users';
    import UI from './ui';

//import layouts
    import '../../ui/layouts/app-layout';
    import '../../ui/layouts/login-layout';

//import loader
    import '../../ui/shared-components/loading';

//trigger language
    FlowRouter.triggers.enter([( con ) => {
        if( con.queryParams.lang === 'tc' ) {
            Session.set( 'lang', 'tc' );
        } else {
            Session.set( 'lang', 'en' );
        }
    }]);

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

//landing page
    FlowRouter.route('/', {
        name: 'landing',
        title: 'HealthyLovedOnes | Homecare, Vertical Care, and Caregiving',
        action() {
            import('../../ui/pages/landing').then(()=> {
                BlazeLayout.render('AppLayout', { main: 'Landing' });
            });
        }
    });

//accounts pages
    PublicOnlyRouter.route('/account', {
        name: 'account',
        title: 'Register with HLO',
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
        title: 'Successfully logged out!',
        action() {
            //logout page render
            import('../../ui/pages/logged-out').then(()=> {
                BlazeLayout.render('LoginLayout', { main: 'LoggedOut' });
            });
        }
    });

    FlowRouter.route('/pick', {
        name: 'pick-type',
        title: 'Choose type',
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
        title: 'Dashboard',
        action() {
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
        title: 'Favorite caregivers',
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
        title: 'Messages',
        action() {
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
        title( params ) {
            return require('../../api/messages').Conversations.findOne( params.id ).subject;
        },
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
        title: 'Edit Profile',
        action() {
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
        title: 'Settings',
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
        title: 'Username',
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
        title: 'Manage Emails',
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
        title: 'Change Password',
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

    PrivateRouter.route('/settings/numbers', {
        name: 'settings.numbers',
        title: 'Manage Mobile Numbers',
        action() {
            import('../../ui/pages/common/settings').then(()=> {
                BlazeLayout.render( 'AppLayout', {
                    main: 'DashboardLayout',
                    content: 'Settings',
                    settings: 'numberSettings'
                });
            });
        }
    });

    /* PrivateRouter.route('/settings/payment', {
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
    }); */

//search routes
    FlowRouter.route('/caregivers', {
        name: 'caregivers.search',
        title: 'Caregiver search',
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
        title: 'Job search',
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
    PrivateRouter.route('/jobs/new', {
        name: 'jobs.new',
        title: 'New Job post',
        action() {
            Meteor.call('user.getType', ( err, res )=> {
                if( res !== 'customer' ) {
                    return FlowRouter.go('dashboard');
                }
                import('../../ui/pages/customer/post-job').then(()=> {
                    BlazeLayout.render( 'AppLayout', {
                        main: 'DashboardLayout',
                        content: 'PostJob'
                    });
                });
            });
        }
    });

    PrivateRouter.route('/edit/:id', {
        name: 'job.edit',
        title: 'Edit Job post',
        action( params ) {
            Meteor.call('user.getType', ( err, res )=> {
                if( res !== 'customer' ) {
                    return FlowRouter.go('dashboard');
                }
                import('../../ui/pages/customer/edit-job').then(()=> {
                    BlazeLayout.render( 'AppLayout', {
                        main: 'DashboardLayout',
                        content: 'EditJob',
                        id: params.id
                    });
                });
            });
        }
    });

//misc pages
    FlowRouter.route('/community', {
        name: 'community',
        title: 'Community Guidelines',
        action() {
            import('../../ui/pages/misc/community').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Community' });
            });
        }
    });
    
    FlowRouter.route('/contact', {
        name: 'contact',
        title: 'Contact Us',
        action() {
            import('../../ui/pages/misc/contact').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Contact' });
            });
        }
    });
    
    FlowRouter.route('/faq', {
        name: 'faq',
        title: 'Frequently Asked Questions',
        action() {
            import('../../ui/pages/misc/faq').then(function(){
                BlazeLayout.render('AppLayout', { main: 'FAQ' });
            });
        }
    });
    
    FlowRouter.route('/privacy', {
        name: 'privacy',
        title: 'Privacy Policy',
        action() {
            import('../../ui/pages/misc/privacy').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Privacy' });
            });
        }
    });
    
    FlowRouter.route('/terms', {
        name: 'terms',
        title: 'Terms of Use',
        action() {
            import('../../ui/pages/misc/terms').then(function(){
                BlazeLayout.render('AppLayout', { main: 'Terms' });
            });
        }
    });
    
    FlowRouter.route('/about', {
        name: 'about',
        title: 'About Us',
        action() {
            import('../../ui/pages/misc/about').then(function(){
                BlazeLayout.render('AppLayout', { main: 'About' });
            });
        }
    });
    
//404 page
    
    FlowRouter.notFound = {
        action() {
            alert('This page is under development!');
        }
    };

//initialise flowrouter title
    new FlowRouterTitle( FlowRouter );

//trigger loaders
    const dbRoutes = [
        'dashboard', 'favorites', 'chat', 'conversation', 'profile.edit',
        'settings', 'settings.username', 'settings.emails', 'settings.passwords',
        'settings.numbers', 'jobs.new', 'job.edit'
    ];
    FlowRouter.triggers.enter([ UI.showLoader ], { except: dbRoutes });

//debug code
    if( Meteor.settings.public.env === 'development' ) {
        AutoForm.debug();
        analytics.debug();
    }
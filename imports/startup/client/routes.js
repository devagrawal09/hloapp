//import libraries
    import { FlowRouter } from 'meteor/kadira:flow-router';
    import { BlazeLayout } from 'meteor/kadira:blaze-layout';

//import partials
    import '../../ui/partials';

//import layouts
    import '../../ui/layouts/app-layout';

//public routes
    FlowRouter.route('/', {
        name: 'landing',
        action(){
            import('../../ui/pages/landing').then(function() {
                BlazeLayout.render('AppLayout', { main: 'Landing' });
            });
        }
    });

    FlowRouter.route('/about', {
        name: 'about',
        action(){
            import('../../ui/pages/misc/about').then(function(){
                BlazeLayout.render('AppLayout', { main: 'About' });
            });
        }
    });

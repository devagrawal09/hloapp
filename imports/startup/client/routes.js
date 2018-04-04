//import libraries
    import { FlowRouter } from 'meteor/kadira:flow-router';
    import { BlazeLayout } from 'meteor/kadira:blaze-layout';

//import partials
    import '../../ui/partials';

//import layouts
    import '../../ui/layouts/app-layout';

//import pages
    import '../../ui/pages/landing';

    FlowRouter.route('/', {
        name: 'landing',
        action(){
            BlazeLayout.render('AppLayout', { main: 'Landing' });
        }
    });

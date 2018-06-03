import { Template } from 'meteor/templating';

import './style.css';
import './about.html';

Template.About.onRendered(function() {
    this.$('.slider-wrapper').append(`
        <script type="text/javascript" src="/js/wowslider.js"></script>
        <script type="text/javascript" src="/js/script.js"></script>
    `);
});

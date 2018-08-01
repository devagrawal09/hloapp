import { Template } from 'meteor/templating';
import './radio-inline-template.html';
Template.atRadioInputInline.replaces('atRadioInput');

Template.body.onRendered(function() {
    $('body').append(`<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=c8ac5d56-de44-41fb-8f7d-9bc29c7ceb13"></script>`);
});
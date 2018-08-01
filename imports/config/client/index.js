import { Template } from 'meteor/templating';
import './radio-inline-template.html';
Template.atRadioInputInline.replaces('atRadioInput');

Template.body.onRendered(function() {
    $('body').append(`<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=7d82c0a9-aa1f-41cf-9544-cc628fbd2ac4"></script>`);
});
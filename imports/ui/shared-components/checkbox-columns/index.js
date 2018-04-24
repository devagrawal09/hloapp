import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import './checkbox-columns.html';

AutoForm.addInputType( 'select-checkbox-columns', {
    template: 'selectCheckboxColumns',
    valueIsArray: true,
    valueOut() {
        var val = [];
        this.find('input[type=checkbox]').each(function () {
            if ($(this).is(":checked")) {
                val.push( $(this).val() );
            }
        });
        return val;
    },
    contextAdjust(context) {
        var itemAtts = _.omit(context.atts);

        // build items list
        context.items = [];

        // Add all defined options
        _.each(context.selectOptions, function (opt) {
            context.items.push({
                name: context.name,
                label: opt.label,
                value: opt.value,
                _id: opt.value,
                selected: (_.contains(context.value, opt.value)),
                atts: itemAtts
            });
        });

        return context;
    }
});

Template.selectCheckboxColumns.inheritsHelpersFrom('select-checkbox');

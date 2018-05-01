import { AutoForm } from 'meteor/aldeed:autoform';

import './filter-templates.html';

AutoForm.addInputType("filter-checkbox", {
    template: "filterCheckbox",
    valueIsArray: true,
    valueOut() {
        var val = [];
        this.find('input[type=checkbox]').each(function () {
            if ($(this).is(":checked")) {
                val.push($(this).val());
            }
        });
        return val;
    },
    contextAdjust(context) {
        var itemAtts = _.omit(context.atts);
        context.items = [];
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

Template.filterCheckbox.helpers({
    atts: function selectedAttsAdjust() {
        var atts = _.clone(this.atts);
        if (this.selected) {
            atts.checked = "";
        }
        delete atts["data-schema-key"];
        return atts;
    },
    dsk: function dsk() {
        return {
            "data-schema-key": this.atts["data-schema-key"]
        }
    }
});

AutoForm.addInputType("search-box", {
    template: "searchBox",
    valueOut: function () {
        return this.val();
    },
    contextAdjust: function (context) {
        if (typeof context.atts.maxlength === "undefined" && typeof context.max === "number") {
            context.atts.maxlength = context.max;
        }
        return context;
    }
});

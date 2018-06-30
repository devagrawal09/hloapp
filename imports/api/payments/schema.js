import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const paymentSchema = new SimpleSchema({
    _id: Datatypes.Id,
    job: Datatypes.Id,
    hours: Number,
    hourlyRate: Number,
    extraCharges: {
        type: Number,
        optional: true
    },
    status: {
        type: String,
        allowedValues: [
            'draft', 'sent', 'paid', 'received', 'declined'
        ]
    }
});

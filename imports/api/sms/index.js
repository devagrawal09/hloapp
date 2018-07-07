import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Builder, Parser } from 'xml2js';

const _parser = new Parser();
const _builder = new Builder();

const sendFunc = ({ to, msg }, callback )=> {
    //construct request object
    const requestObj = { ShortMessage: {
        UserID: Meteor.settings.xgate.id,
        UserPassword: Meteor.settings.xgate.password,
        MessageType: 'TEXT',
        MessageReceiver: to,
        MessageBody: msg
    }};
    //build xml string from request object
    const requestStr = _builder.buildObject( requestObj );
    //place http call
    HTTP.post('https://smsc.xgate.com.hk/smshub/sendsms', {
        content: requestStr
    }, ( err, result )=> {
        //general http error
        if( err ) return callback( err );
        //http call succesful, parse result xml
        _parser.parseString( result.content, ( err, res )=> {
            //error parsing
            if( err ) return callback( err );
            const response = res.ShortMessageResponse;
            //successful
            if( response.Success ) return callback( null, response );
            //invalid mobile number
            if( response.ResponseCode === 'C004') return callback( new Meteor.Error(
                'mobile.invalid', 'Invalid mobile number!'
            ));
            //internal server error
            return callback( new Error(
                `ERRCODE: ${response.ResponseCode}, MSG: ${response.ResponseMessage}`
            ));
        });
    });
}

export const sendSMS = Meteor.wrapAsync( sendFunc );

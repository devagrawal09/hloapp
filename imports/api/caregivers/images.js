import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { FilesCollection } from 'meteor/ostrio:files';

let stream, S3, fs, s3Conf, bound, s3 = {};

if( Meteor.isServer ) {
    stream = require('stream');
    S3 = require('aws-sdk/clients/s3');
    fs = require('fs');

    s3Conf = Meteor.settings.s3;
    bound = Meteor.bindEnvironment((callback) => {
        return callback();
    });
    
    s3 = new S3({
        secretAccessKey: s3Conf.secret,
        accessKeyId: s3Conf.key,
        region: s3Conf.region,
        // sslEnabled: true,
        httpOptions: {
            timeout: 6000,
            agent: false
        }
    });
}

export const CaregiverImages = new FilesCollection({
    debug: false,
    storagePath: 'assets/app/uploads/caregiver-images',
    collectionName: 'caregiver-images',
    allowClientCode: false,
    onAfterUpload(fileRef) {
        
        _.each(fileRef.versions, (vRef, version) => {
            
            const filePath = 'files/' + (Random.id()) + '-' + version + '.' + fileRef.extension;

            s3.putObject({
                // ServerSideEncryption: 'AES256', // Optional
                StorageClass: 'STANDARD',
                Bucket: s3Conf.bucket,
                Key: filePath,
                Body: fs.createReadStream(vRef.path),
                ContentType: vRef.type,
            }, (error) => {
                bound(() => {
                    if (error) {
                        console.error(error);
                    } else {
                        // Update FilesCollection with link to the file at AWS
                        const upd = { $set: {} };
                        upd['$set']['versions.' + version + '.meta.pipePath'] = filePath;

                        this.collection.update({
                            _id: fileRef._id
                        }, upd, (updError) => {
                            if (updError) {
                                console.error(updError);
                            } else {
                                // Unlink original files from FS after successful upload to AWS:S3
                                this.unlink(this.collection.findOne(fileRef._id), version);
                            }
                        });
                    }
                });
            });
        });
    },

    interceptDownload(http, fileRef, version) {
        let path;

        if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
            path = fileRef.versions[version].meta.pipePath;
        }

        if (path) {
            
            const opts = {
                Bucket: s3Conf.bucket,
                Key: path
            };

            if (http.request.headers.range) {
                const vRef = fileRef.versions[version];
                let range = _.clone(http.request.headers.range);
                const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
                const start = parseInt(array[1]);
                let end = parseInt(array[2]);
                if (isNaN(end)) {
                    
                    end = (start + this.chunkSize) - 1;
                    if (end >= vRef.size) {
                        end = vRef.size - 1;
                    }
                }
                opts.Range = `bytes=${start}-${end}`;
                http.request.headers.range = `bytes=${start}-${end}`;
            }

            const fileColl = this;
            s3.getObject(opts, function (error) {
                if (error) {
                    console.error(error);
                    if (!http.response.finished) {
                        http.response.end();
                    }
                } else {
                    if (http.request.headers.range && this.httpResponse.headers['content-range']) {
                        // Set proper range header in according to what is returned from AWS:S3
                        http.request.headers.range = this.httpResponse.headers['content-range'].split('/')[0].replace('bytes ', 'bytes=');
                    }

                    const dataStream = new stream.PassThrough();
                    fileColl.serve(http, fileRef, fileRef.versions[version], version, dataStream);
                    dataStream.end(this.data.Body);
                }
            });

            return true;
        }
        
        return false;
    }
});

const _origRemove = CaregiverImages.remove;
CaregiverImages.remove = function(search) {
    const cursor = this.collection.find(search);
    cursor.forEach((fileRef) => {
        _.each(fileRef.versions, (vRef) => {
            if (vRef && vRef.meta && vRef.meta.pipePath) {
                // Remove the object from AWS:S3 first, then we will call the original FilesCollection remove
                s3.deleteObject({
                    Bucket: s3Conf.bucket,
                    Key: vRef.meta.pipePath,
                }, (error) => {
                    bound(() => {
                        if (error) console.error(error);
                    });
                });
            }
        });
    });

    //remove original file from database
    _origRemove.call(this, search);
};
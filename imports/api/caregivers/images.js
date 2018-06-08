import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { FilesCollection } from 'meteor/ostrio:files';

let gcs, bucket, bucketMetadata, Request, bound, Collections = {}, debug = false;

if( Meteor.settings.public.env === 'development' ) debug = true;

if ( Meteor.isServer ) {
    gcs = Npm.require('@google-cloud/storage')({
        projectId: 'hloapp-205720',
        credentials: Meteor.settings.gcloud
    });
    bucket = gcs.bucket('hloimages');
    bucket.getMetadata(function (error, metadata, apiResponse) {
        if (error) {
            console.error(error);
        }
    });
    bound = Meteor.bindEnvironment(function (callback) {
        return callback();
    });
}

export const CaregiverImages = new FilesCollection({
    debug,
    collectionName: 'caregiver-images',
    allowClientCode: false,
    onBeforeUpload(file) {
        // Allow upload files under 5MB, and only in png/jpg/jpeg formats
        if (file.size <= 5242880 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        }
        return 'Please upload image, with size equal or less than 10MB';
    },
    onAfterUpload(fileRef) {
        // In the onAfterUpload callback, we will move the file to Google Cloud Storage
        var self = this;
        _.each(fileRef.versions, function(vRef, version) {
            // We use Random.id() instead of real file's _id
            // to secure files from reverse engineering
            // As after viewing this code it will be easy
            // to get access to unlisted and protected files
            var filePath = "files/" + (Random.id()) + "-" + version + "." + fileRef.extension;
            // Here we set the neccesary options to upload the file, for more options, see
            // https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.36.0/storage/bucket?method=upload
            var options = {
                destination: filePath,
                resumable: false
            };

            bucket.upload(fileRef.path, options, function(error, file) {
                bound(function() {
                    var upd;
                    if (error) {
                        console.error(error);
                    } else {
                        upd = {
                            $set: {}
                        };
                        upd['$set']["versions." + version + ".meta.pipePath"] = filePath;
                        self.collection.update({
                            _id: fileRef._id
                        }, upd, function (error) {
                            if (error) {
                                console.error(error);
                            } else {
                                // Unlink original files from FS
                                // after successful upload to Google Cloud Storage
                                self.unlink(self.collection.findOne(fileRef._id), version);
                            }
                        });
                    }
                });
            });
        });
    },
    interceptDownload(http, fileRef, version) {
        let path, ref, ref1, ref2;
        path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipePath : void 0 : void 0 : void 0;
        let vRef = ref1;
        if (path) {
            // If file is moved to Google Cloud Storage
            // We will pipe request to Google Cloud Storage
            // So, original link will stay always secure
            var remoteReadStream = getReadableStream(http, path, vRef);
            this.serve(http, fileRef, vRef, version, remoteReadStream);
            return true;
        } else {
            // While the file has not been uploaded to Google Cloud Storage, we will serve it from the filesystem
            return false;
        }
    }
});

if ( Meteor.isServer ) {
    // Intercept file's collection remove method to remove file from Google Cloud Storage
    var _origRemove = CaregiverImages.remove;

    CaregiverImages.remove = function(search) {
        var cursor = this.collection.find(search);
        cursor.forEach(function (fileRef) {
            _.each(fileRef.versions, function (vRef) {
                var ref;
                if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
                    bucket.file(vRef.meta.pipePath).delete(function (error) {
                        bound(function () {
                            if (error) {
                                console.error(error);
                            }
                        });
                    });
                }
            });
        });
        // Call the original removal method
        _origRemove.call(this, search);
    };
}

function getReadableStream(http, path, vRef) {
    let array, end, partial, remoteReadStream, reqRange, responseType, start, take;

    if (http.request.headers.range) {
        partial = true;
        array = http.request.headers.range.split(/bytes=([0-9]*)-([0-9]*)/);
        start = parseInt(array[1]);
        end = parseInt(array[2]);
        if (isNaN(end)) {
            end = vRef.size - 1;
        }
        take = end - start;
    } else {
        start = 0;
        end = vRef.size - 1;
        take = vRef.size;
    }

    if (partial || (http.params.query.play && http.params.query.play === 'true')) {
        reqRange = {
            start: start,
            end: end
        };
        if (isNaN(start) && !isNaN(end)) {
            reqRange.start = end - take;
            reqRange.end = end;
        }
        if (!isNaN(start) && isNaN(end)) {
            reqRange.start = start;
            reqRange.end = start + take;
        }
        if ((start + take) >= vRef.size) {
            reqRange.end = vRef.size - 1;
        }
        if ((reqRange.start >= (vRef.size - 1) || reqRange.end > (vRef.size - 1))) {
            responseType = '416';
        } else {
            responseType = '206';
        }
    } else {
        responseType = '200';
    }

    if (responseType === "206") {
        remoteReadStream = bucket.file(path).createReadStream({
            start: reqRange.start,
            end: reqRange.end
        });
    } else if (responseType === "200") {
        remoteReadStream = bucket.file(path).createReadStream();
    }

    return remoteReadStream;
}

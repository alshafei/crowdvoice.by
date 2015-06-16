'use strict';

require('./../../bin/server.js');

CONFIG.database.logQueries = false;

console.log('');
console.log('...');

var m = new Post({id:3});
var propertyName = 'image';

m.uploadImage(propertyName, process.argv[2], function () {
  console.log(m);
  Object.keys(m[propertyName].versions).forEach(function (version) {
    console.log(m[propertyName].url(version));
    console.log(m[propertyName].meta(version));
  });
});

// m.imageBaseUrl = "development/post_3/image_{versionName}.jpeg"
// m.image.processVersions(function () {
//   console.log(arguments);
//   Object.keys(m[propertyName].versions).forEach(function (version) {
//     console.log(m[propertyName].url(version));
//     console.log(m[propertyName].meta(version));
//   });
// });

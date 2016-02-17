angular.module('DPTB.factories', [])

.factory("Times", function($firebaseArray) {
  var timesRef = new Firebase("https://dptb.firebaseio.com/times");
  return $firebaseArray(timesRef);
})
angular.module('DPTB.controllers', [])

.controller('BtnCtrl', function($scope, $ionicModal, $filter, $interval, $firebaseArray){

	var ref = new Firebase("https://dptb.firebaseio.com/times");
  // download the data into a local object
  $scope.currentTime = (new Date).getTime();
	$scope.times = $firebaseArray(ref);

	$scope.calcTime = function(time){
		return (new Date).getTime() - time.last;
	}

	$scope.times.$loaded()
	    .then(function(){
        // access events here;
				$scope.times.forEach(function(time){
					time.since = $scope.calcTime(time);
				})
				$scope.countUp();
				// $scope.calcTime();
	    });

	$scope.updateTime = function(index){
		var time = $scope.times.$getRecord($scope.times[index].$id);
		if ($scope.times[index].since > $scope.times[index].best){
			$scope.newRecord = true;
			time.best = $scope.times[index].since;
		} else {
			$scope.newRecord = false;
		}
		$scope.times[index].last = (new Date).getTime();
		$scope.times[index].since = 0;
		$scope.times.$save(time).then(function(){
		});
		// console.log($scope.times[index].last);
		// console.log($scope.times[index].best);
	}

	$scope.countUp = function(){
		$interval(function(){
			$scope.times.forEach(function(time){
				time.since += 1000
			})
		}, 1000);
	}


	var now = (new Date).getTime();

	// $scope.times = Times;
	// console.log($scope.times.length);

	$ionicModal.fromTemplateUrl('templates/stats-modal.html', {
		scope: $scope,
		controller: 'BtnCtrl'
	}).then(function(modal){
		$scope.modal = modal;
	});
	$scope.openModal = function(index){
		$scope.num = index
		$scope.finalTime = $scope.times[index].since;
		$scope.updateTime(index);
		$scope.modal.show();
	};
	$scope.closeModal = function(){
		$scope.modal.hide();
	};

	// long press to clear count
	$scope.clearTime = function(index) {
		var time = $scope.times.$getRecord($scope.times[index].$id);
		time.last = (new Date).getTime();
		time.since = 0;
		$scope.times.$save(time).then(function(){
		});
	}

	// just to check on stuff randomly
	$scope.printStuff = function(){
		console.log('stuff');
	}

	// clear time 
});

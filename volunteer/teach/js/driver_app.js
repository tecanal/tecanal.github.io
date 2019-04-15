/* global firebase, angular, moment */

// Create Angular App Module
var app = angular.module("car-reserve", ["firebase"]);

app.controller("CarReserveCtrl", function($scope, $window, $firebaseArray) {
	// Connect to cars database
	var carsRef = firebase.database().ref().child("cars");
	$scope.cars = $firebaseArray(carsRef);
	
	// Connect to hours of database
	var hoursRef = firebase.database().ref().child("hours");
	$scope.hours = $firebaseArray(hoursRef);
	
	// When data is loaded
	carsRef.on('value', function(snapshot) {
		// For every entry in the database
		snapshot.forEach(function(child) {
			var entry = child.val();
			
			// Get today's date
			var today = new Date(moment().year(), moment().month(), moment().date());
			today = moment(today);
			
			// Get session date
			var sessionDate = entry.sessionDate;
			var test = sessionDate.split("/");
			// Year, Month (minus one), Day
			var date = new Date(parseInt(test[2]), parseInt(test[0]) - 1, parseInt(test[1]));
			date = moment(date);
			
			// See if outreach session has already passed
			if (today.isAfter(sessionDate) && today != sessionDate) {
				var car = child.val();
					
				// Make name into ref friendly format
				var driverName = car.driver;
				driverName.replace(" ", "-");
					
				// Select section of databse for driver
				hoursRef = firebase.database().ref().child("hours/" + driverName);
				$scope.hours = $firebaseArray(hoursRef);
									
				// Add hours as driver
				$scope.hours.$add({
					"date": car.sessionDate,
					"location": car.destination,
					"role": "Driver",
					"hours": 3
				});
					
				// For each rider in car
				var names = car.names;
				for (var name of names) {
					// Make name into ref friendly format
					name.replace(" ", "-");
					
					if (driverName != name) {
						// Select section of databse for volunteer
						hoursRef = firebase.database().ref().child("hours/" + name);
						$scope.hours = $firebaseArray(hoursRef);
										
						// Add hours as volunteer
						$scope.hours.$add({
							"date": car.sessionDate,
							"location": car.destination,
							"role": "Volunteer",
							"hours": 2
						});
					}
				}
				
				// Delete car
				$scope.cars = $firebaseArray(carsRef);
				carsRef.child(child.key).remove();
				
				// Update $scope.cars array
				$scope.cars = $firebaseArray(carsRef);
				
				// Update $scope.hours array
				hoursRef = firebase.database().ref().child("hours");
				$scope.hours = $firebaseArray(hoursRef);
			}

		});
	});
	
	$scope.dates = [];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	$scope.getDates = function() {
		$scope.dates.length = 0;
		
		// Add Mattie B. outreach dates	
		if ($scope.destination != undefined && $scope.destination.name == "Mattie B. Uzzle Outreach Center") {
			var first = moment().day("Friday");
			for (var i = 1; i < 5; i++) {
				var date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
				var dateLong = "Friday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
				$scope.dates.push({"value": date, "long_date": dateLong});
				first = moment().day("Friday").add((7 * i), 'days');
			}
		}
		// Add IOSC outreach dates
		else if ($scope.destination != undefined && $scope.destination.name == "Immigration Outreach Service Center") {
			var first = moment().day("Saturday");
			for (var i = 1; i < 5; i++) {
				var date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
				var dateLong = "Saturday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
				$scope.dates.push({"value": date, "long_date": dateLong});
				first = moment().day("Saturday").add((7 * i), 'days');
			}
		}
		// Add Tench Tilghman outreach dates
		else if ($scope.destination != undefined && $scope.destination.name == "Tench Tilghman") {
			var first = moment().day("Tuesday");
			var second = moment().day("Thursday");
			
			for (var i = 1; i < 3; i++) {
				var date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
				var dateLong = "Tuesday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
				$scope.dates.push({"value": date, "long_date": dateLong});
				
				date = (second.get('month') + 1) + "/" + second.get('date') + "/" + second.get('year');
				dateLong = "Thursday: " + months[second.get('month')] + " " + second.get('date') + ", " + second.get('year');
				$scope.dates.push({"value": date, "long_date": dateLong});
				
				first = moment().day("Tuesday").add((7 * i), 'days');
				second = moment().day("Thursday").add((7 * i), 'days');
			}
		 }
		 // Add Tench Tilghman outreach dates
		else if ($scope.destination != undefined && $scope.destination.name == "EK2K") {
			var first = moment().day("Tuesday");
			var second = moment().day("Thursday");
			
			for (var i = 1; i < 3; i++) {
				var date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
				var dateLong = "Tuesday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
				$scope.dates.push({"value": date, "long_date": dateLong});
				
				date = (second.get('month') + 1) + "/" + second.get('date') + "/" + second.get('year');
				dateLong = "Thursday: " + months[second.get('month')] + " " + second.get('date') + ", " + second.get('year');
				$scope.dates.push({"value": date, "long_date": dateLong});
				
				first = moment().day("Tuesday").add((7 * i), 'days');
				second = moment().day("Thursday").add((7 * i), 'days');
			}
 		}
	};

	// Adds a new car to the database with all the form data from Driver Registration page
	$scope.addCar = function() {
		// Add data to the database
		$scope.cars.$add({
		  destination: $scope.destination.name,
		  startingPoint: $scope.startingPoint,
		  driver: $scope.driverText,
		  numRiders: 1,
		  maxRiders: $scope.maxRidersText,
		  sessionDate: $scope.sessionDate,
		  names: [$scope.driverText],
		  email: $scope.emailText,
		  phoneNumber: $scope.phoneNumberText
		});

		
		$window.location.href = 'http://volunteer.tecanal.org/teach/driver';
	};

	// Add rider to the car
	$scope.addRider = function(carNum) {
		var currentCar = $scope.cars[carNum];

		// Checks if maximum amount of riders has been reached
		if (currentCar.numRiders != currentCar.maxRiders) {
			// Get persons name to add to car
			var name = prompt("What is your name?");
			var number = prompt("What is your number?");
			
			if (name != null && name  !== "") {
				// Add rider name to car
				currentCar.names.push((name + "(" + number + ")").trim());
				
				// Add rider to the car
				currentCar.numRiders++;
			}
				
			// Update the database
			$scope.cars.$save(currentCar);
		}
	};

	$scope.removeRider = function(carNum) {
		var currentCar = $scope.cars[carNum];

		var name = prompt("What is your name?");

		// Find name of person that can't go anymore
		for (var i = 0; i < currentCar.names.length; i++) {
		  // Prevent deletion of driver
		  if (name === currentCar.driver) {
			console.log("Equal");
			carsRef.child(currentCar.key).remove();

			// Exit name checking
			break;
		  }
		  if (currentCar.names[i].includes(name)) {
			// Remove name of person who can't go
			currentCar.names.splice(i, 1);

			// Remove person from rider count
			currentCar.numRiders--;
		  }
		}

		// Update the database
		$scope.cars.$save(currentCar);
	};
});
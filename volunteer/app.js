const app = angular.module("car-reserve", ["firebase", "ngRoute"]);

/**
 * Handle application routing so that it is all in one page.
 */
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when("/", {
            title: "TeCanal Outreach Signup",
            templateUrl: "templates/outreach-signup.html",
            controller: 'OutreachSignupCtrl'
        })
        .when("/pinkheadphones", {
            title: "Volunteer Portal Admin Panel",
            templateUrl: "templates/admin.html",
            controller: 'AdminCtrl'
        })
        .when("/why-volunteer", {
            title: "Why Volunteer?",
            templateUrl: "templates/why-volunteer.html"
        })
        .when("/training-material", {
            title: "Training Material",
            templateUrl: "templates/training-material.html"
        })
        .when("/leaderboard", {
            title: "Volunteer Hours Leaderboard",
            templateUrl: "templates/leaderboard.html",
            controller: 'LeaderboardCtrl'
        })
        .when("/outreach-signup", {
            title: "TeCanal Outreach Signup",
            templateUrl: "templates/outreach-signup.html",
            controller: 'OutreachSignupCtrl'
        })
        .when("/driver-registration", {
            title: "Driver Registration",
            templateUrl: "templates/driver-registration.html",
            controller: 'DriverRegistrationCtrl'
        })
        .when("/home", {
            title: "volunteer @ tecanal",
            templateUrl: "templates/home.html",
            controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: "/"
        });
}]);

/**
 * Display the title based on whatever route it's on.
 */
app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

app.controller("HomeCtrl", function ($scope) {
    const TECANAL_WAIVER = {
        name: "TeCanal General Waiver",
        link: "http://res.cloudinary.com/tecanal/raw/upload/v1491913627/TeCanalWaiverOriginal_wwmsfr.pdf"
    };

    $scope.outreaches = [
        {
            name: "Mattie B. Uzzle Outreach Center",
            time: "Fridays; 4:00pm-5:00pm",
            address: "1212 N Chester St. Baltimore, MD",
            link: "https://www.google.com/maps/place/Mattie+B.+Uzzle+Outreach+Center/@39.3049494,-76.5903036,17z/data=!3m1!4b1!4m5!3m4!1s0x89c8046759570a2b:0xa1854f4e1c094c82!8m2!3d39.3049494!4d-76.5881149",
            waivers: [
                TECANAL_WAIVER,
                {
                    name: "Mattie B. Uzzle Waiver",
                    link: "http://res.cloudinary.com/tecanal/raw/upload/v1491913627/MattieB.UzzleProceduresPolicies_ahmivp.pdf"
                }
            ]
        },
        {
            name: "Immigration Outreach Service Center",
            time: "Saturdays; 3:00pm-4:00pm",
            address: "5302 Harford Rd. Baltimore, MD",
            link: "https://www.google.com/maps/place/Immigration+Outreach+Service+Center/@39.355745,-76.5913927,17z/data=!3m1!4b1!4m5!3m4!1s0x89c80584b27abda9:0x8311976ca1c552bd!8m2!3d39.355745!4d-76.589204",
            waivers: [
                TECANAL_WAIVER,
                {
                    name: "Baltimore Archdiocese Application",
                    link: "http://res.cloudinary.com/tecanal/raw/upload/v1516559382/ArchdioceseApp_oynsvp.pdf"
                },
                {
                    name: "IOSC Volunteer Application",
                    link: "http://res.cloudinary.com/tecanal/raw/upload/v1516559207/IOSCApp_h9ggxl.pdf"
                }
            ]
        },
        {
            name: "Tench Tilghman Elementary School",
            time: "Tuesdays, Thursdays; 3:15pm-4:15pm",
            address: "600 N Patterson Park Ave Baltimore, MD",
            link: "https://www.google.com/maps/place/Tench+Tilghman+Elementary%2FMiddle+School/@39.2977925,-76.5874221,17z/data=!3m1!4b1!4m5!3m4!1s0x89c80465a31ad6e3:0xb83c2537577e235f!8m2!3d39.2977925!4d-76.5852334",
            waivers: [
                TECANAL_WAIVER
            ]
        },
        {
            // Code for John Ruhrah
            name: "John Ruhrah Elementary School",
            time: "Mondays, Wednesdays; 4:10pm-5:10pm",
            address: "6820 Fait Ave, Baltimore, MD",
            link: "https://www.google.com/maps/place/John+Ruhrah+Elementary+School/@39.2513723,-76.823086,11z/data=!4m19!1m13!4m12!1m4!2m2!1d-76.837499!2d39.2626751!4e1!1m6!1m2!1s0x89c80401139a1439:0xd067401f4b5997c8!2sjohn+ruhrah!2m2!1d-76.5305949!2d39.2858364!3m4!1s0x89c80401139a1439:0xd067401f4b5997c8!8m2!3d39.2858364!4d-76.5305949",
            waivers: [
                TECANAL_WAIVER
            ]
        }
    ];
});

app.controller("LeaderboardCtrl", function ($scope, $firebaseArray) {
    // Connect to hours database
    const hoursRef = firebase.database().ref().child("hours");
    $scope.hours = $firebaseArray(hoursRef);
});

/**
 * Handle the Outreach Signup page.
 */
app.controller("OutreachSignupCtrl", function ($scope, $firebaseArray, $firebaseObject) {
    $scope.noCars = false;

    // Connect to cars database
    const carsRef = firebase.database().ref().child("cars");
    $scope.cars = $firebaseArray(carsRef);

    /**
     * Add a new rider to the car.
     */
    $scope.addRider = function(carNum) {
        let currentCar = $scope.cars[carNum];

        // Checks if maximum amount of riders has been reached
        if (currentCar.numRiders != currentCar.maxRiders) {
            let name;
            let isValidName = false;

            // Validate the name so it is first and last name with no symbols
            while (!isValidName) {
                // Get name from user
                name = prompt("What is your name?");

                let errorMsg = "";
                isValidName = true;

                // Go through every single character and check if it is a letter
                for (let char of name) {
                    if (".!@#$%^&*[]{}()_+=/><\\".indexOf(char) != -1) {
                        isValidName = false;
                        errorMsg += "No symbols allowed.\n";

                        break;
                    }
                }

                // Trim extra whitespace off of name
                name = name.trim();

                // Check if there is a space delineating first and last name
                if (name.indexOf(" ") == -1) {
                    isValidName = false;
                    errorMsg += "Please enter first and last name.\n";
                }

                // Alert what problem(s) there was with the name 
                if (!isValidName) alert(errorMsg);
            }
            
            // Add rider name to car
            currentCar.names.push(name);

            // Add rider to the car
            currentCar.numRiders++;

            // Update the database
            $scope.cars.$save(currentCar);
        }
    };

    /**
     * Remove a rider from the car.
     */
    $scope.removeRider = function(carNum) {
        let currentCar = $scope.cars[carNum];

        let name = prompt("What is your name?");

        // Find name of person that can't go anymore
        for (let i = 0; i < currentCar.names.length; i++) {
            // Prevent deletion of driver
            if (name === currentCar.driver) {
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

    // When data is loaded
    carsRef.on('value', function(snapshot) {
        // For every entry in the database
        snapshot.forEach(function(child) {
            let entry = child.val();

            // Get today's date
            let today = new Date(moment().year(), moment().month(), moment().date());
            today = moment(today);

            // Get session date
            let sessionDate = entry.sessionDate;
            let test = sessionDate.split("/");
            // Year, Month (minus one), Day
            let date = new Date(parseInt(test[2]), parseInt(test[0]) - 1, parseInt(test[1]));
            date = moment(date);

            // See if outreach session has already passed
            if (today.isAfter(sessionDate) && today != sessionDate) {
                // Get names of people riding in car
                let names = entry.names;

                // If the car had people riding in it
                if (names) {
                    // Make name into ref friendly format
                    let driverName = entry.driver;
                    driverName.replace(" ", "-");

                    // Select section of databse for driver
                    hoursRef = firebase.database().ref().child("hours/" + driverName);
                    $scope.driverHours = $firebaseObject(hoursRef);

                    // Wait until the object is loaded to check for history
                    $scope.driverHours.$loaded(function() {
                        // Add hours to driver history
                        if ($scope.driverHours.history) {
                            $scope.driverHours.totalHours += 3;

                            $scope.driverHours.history.push({
                                "date": entry.sessionDate,
                                "location": entry.destination,
                                "role": "Driver",
                                "hours": 3
                            });
                        }
                        // Create driver history
                        else {
                            $scope.driverHours.totalHours = 3;

                            $scope.driverHours.history = [{
                                "date": entry.sessionDate,
                                "location": entry.destination,
                                "role": "Driver",
                                "hours": 3
                            }];
                        }

                        // Save the updated driver object
                        $scope.driverHours.$save();
                    });

                    for (let name of names) {
                        // Make name into ref friendly format
                        name.replace(" ", "-");

                        if (driverName != name) {
                            // Select section of databse for volunteer
                            hoursRef = firebase.database().ref().child("hours/" + name);
                            $scope.volunteerHours = $firebaseObject(hoursRef);

                            $scope.volunteerHours.$loaded(function() {
                                // Add hours to volunteer history
                                if ($scope.volunteerHours.history) {
                                    $scope.volunteerHours.totalHours += 2;

                                    // Add hours as volunteer
                                    $scope.volunteerHours.history.push({
                                        "date": entry.sessionDate,
                                        "location": entry.destination,
                                        "role": "Volunteer",
                                        "hours": 2
                                    });
                                }
                                // Create volunteer history
                                else {
                                    $scope.volunteerHours.totalHours = 2;

                                    $scope.volunteerHours.history = [{
                                        "date": entry.sessionDate,
                                        "location": entry.destination,
                                        "role": "Volunteer",
                                        "hours": 2
                                    }];
                                }

                                // Save the updated volunteer
                                $scope.volunteerHours.$save();
                            });
                        }
                    }
                }

                // Delete car
                $scope.cars = $firebaseArray(carsRef);
                carsRef.child(child.key).remove();

                // Update $scope.cars array
                $scope.cars = $firebaseArray(carsRef);
            }
        });
    });
});

/**
 * Handle the admin page.
 */
app.controller("DriverRegistrationCtrl", function ($scope, $location, $firebaseArray) {
    // Connect to cars database
    let carsRef = firebase.database().ref().child("cars");
    $scope.cars = $firebaseArray(carsRef);

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

        $location.path("outreach-signup");
    };

    $scope.dates = [];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $scope.getDates = function () {
        // If the destination is undefined, don't do anything
        if (!$scope.destination) return;

        // $scope.dates.length = 0;

        // Add Mattie B. outreach dates	
        if ($scope.destination.name == "Mattie B. Uzzle Outreach Center") {
            let first = moment().day("Friday");
            for (let i = 1; i < 5; i++) {
                let date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
                let dateLong = "Friday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });
                first = moment().day("Friday").add((7 * i), 'days');
            }
        }
        // Add IOSC outreach dates
        else if ($scope.destination.name == "Immigration Outreach Service Center") {
            let first = moment().day("Saturday");
            for (let i = 1; i < 5; i++) {
                let date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
                let dateLong = "Saturday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });
                first = moment().day("Saturday").add((7 * i), 'days');
            }
        }
        // Add Tench Tilghman outreach dates
        else if ($scope.destination.name == "Tench Tilghman") {
            let first = moment().day("Tuesday");
            let second = moment().day("Thursday");

            for (let i = 1; i < 3; i++) {
                let date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
                let dateLong = "Tuesday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });

                date = (second.get('month') + 1) + "/" + second.get('date') + "/" + second.get('year');
                dateLong = "Thursday: " + months[second.get('month')] + " " + second.get('date') + ", " + second.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });

                first = moment().day("Tuesday").add((7 * i), 'days');
                second = moment().day("Thursday").add((7 * i), 'days');
            }
        }
        // Add EK2K outreach dates
        else if ($scope.destination.name == "EK2K") {
            let first = moment().day("Tuesday");
            let second = moment().day("Thursday");

            for (let i = 1; i < 3; i++) {
                let date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
                let dateLong = "Tuesday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });

                date = (second.get('month') + 1) + "/" + second.get('date') + "/" + second.get('year');
                dateLong = "Thursday: " + months[second.get('month')] + " " + second.get('date') + ", " + second.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });

                first = moment().day("Tuesday").add((7 * i), 'days');
                second = moment().day("Thursday").add((7 * i), 'days');
            }
        }
        // Add John Ruhrah dates
        else if ($scope.destination.name == "John Ruhrah") {
            let first = moment().day("Monday");
            let second = moment().day("Wednesday");

            for (let i = 1; i < 3; i++) {
                let date = (first.get('month') + 1) + "/" + first.get('date') + "/" + first.get('year');
                let dateLong = "Monday: " + months[first.get('month')] + " " + first.get('date') + ", " + first.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });

                date = (second.get('month') + 1) + "/" + second.get('date') + "/" + second.get('year');
                dateLong = "Wednesday: " + months[second.get('month')] + " " + second.get('date') + ", " + second.get('year');
                $scope.dates.push({ "value": date, "long_date": dateLong });

                first = moment().day("Monday").add((7 * i), 'days');
                second = moment().day("Wednesday").add((7 * i), 'days');
            }
        }
    };
});

app.controller("AdminCtrl", function ($scope, $firebaseObject, $firebaseArray) {
    $scope.viewType = "";

    // Connect to cars database
    const carsRef = firebase.database().ref().child("cars");
    $scope.cars = $firebaseArray(carsRef);

    // Connect to hours database
    const hoursRef = firebase.database().ref().child("hours");
    $scope.people = $firebaseArray(hoursRef);

    /**
     * Deletes the car from the database.
     */
    $scope.deleteCar = function(carIndex) {
        $scope.cars.$remove(carIndex);
    };

    $scope.removePerson = function(carIndex, personIndex) {
        // console.log($scope.cars[carIndex]);

        $scope.cars[carIndex].names.splice(personIndex, 1);
        $scope.cars[carIndex].numRiders--;

        $scope.cars.$save($scope.cars[carIndex]);
    }

    /**
     * Deletes an outreach entry in the volunteer's history and removes it from the
     * total hours count.
     */
    $scope.deleteHistoryEntry = function(name, index) {
        let volunteerRef = firebase.database().ref().child("hours/" + name);
        let volunteer = $firebaseObject(volunteerRef);

        volunteer.$loaded(function () {
            // Remove hours from total hours count
            if (volunteer.history[index].role == "Driver")
                volunteer.totalHours -= 3;
            else
                volunteer.totalHours -= 2;

            // Remove the history entry
            volunteer.history.splice(index, 1);

            // Save the object which will live update the interface
            volunteer.$save();
        });
    };
});

/**
 * Display phone numbers in a pretty way.
 * https://stackoverflow.com/questions/12700145/format-telephone-and-credit-card-numbers-in-angularjs
 */
app.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        let value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        let country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (city + "-" + number).trim();
    };
});

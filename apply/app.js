var app = angular.module("tecanal-apply", ["firebase", "ngRoute"]);

/**
 * Allow the Firebase Auth module to be accessed in any controller.
 */
app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

/**
 * Handle application routing so that it is all in one page.
 */
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider
        .when("/", {
            templateUrl: "templates/home.html",
            controller: 'InfoPageCtrl'
        })
        .when("/admin", {
            templateUrl: "templates/admin.html",
            controller: 'AdminCtrl'
        })
        .when("/login", {
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl'
        })
        .when("/register", {
            templateUrl: "templates/register.html",
            controller: 'RegistrationCtrl'
        })
        .when("/eo", {
            templateUrl: "templates/eo-info.html",
            controller: 'InfoPageCtrl'
        })
        .when("/swe", {
            templateUrl: "templates/swe-info.html",
            controller: 'InfoPageCtrl'
        })
        .when("/biz-dev", {
            templateUrl: "templates/biz-dev-info.html",
            controller: 'InfoPageCtrl'
        })
        .when("/applications", {
            templateUrl: "templates/applications.html",
            controller: 'ApplicationsCtrl'
        })
        .when("/application/eo", {
            templateUrl: "templates/eo-application.html",
            controller: 'EOApplicationCtrl'
        })
        .otherwise({
            redirectTo: "/"
        });
}]);

/**
 * Get the File blob from file input and enable it to be stored in a Angular scope variable.
 */
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    };
}]);

/**
 * Handle the admin page.
 */
app.controller("AdminCtrl", function ($scope, $location, $firebaseArray, Auth) {
    // Scope variable to acccess authentication functionality
    $scope.auth = Auth;

    // Connect to Firebase
    var ref = firebase.database().ref();
    $scope.userList = $firebaseArray(ref);

    // EO and VoCo category user object lists
    $scope.eoList = [];
    $scope.vocoList = [];

    // Scope variables for sorting
    $scope.sortType = 'name'; // set the default sort type
    $scope.sortReverse = false;

    /**
     * Wait until the data is fully loaded, then sort them into EO and VoCo applicant categories.
     */
    $scope.userList.$loaded().then(function() {
        // Go through every single user object
        for (var user of $scope.userList) {
            // If the user has filled out the EO application
            if (user.eo) $scope.eoList.push(user.eo);

            // If the user has filled out the VoCo application
            if (user.voco) $scope.vocoList.push(user.voco);
        }
    });

    /**
     * Show user application data in the modal when the user is clicked in the table view.
     */
    $scope.showData = function(user) {
        // Access application data from the user
        $scope.modalData = user;

        // Show the modal
        $("#myModal").modal('show');
    };

    /**
    * Checks if the user is logged in as admin, and redirects to home if they aren't.
    */
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
        // If user is logged in
        if (firebaseUser) {
            // If user isn't admin, redirect to home
            if (firebaseUser.email != "admin@tecanal.org") $location.path("");
        }
        else {
            $location.path("");
        }
    });

    /**
     * Logs the user out of the application view and go back to home.
     */
    $scope.logout = function () {
        // Sign out of Firebase
        $scope.auth.$signOut();
    };
});

/**
 * Handle the Registration page logic.
 */
app.controller("RegistrationCtrl", function($scope, $location, Auth) {
    // Scope variables for registration
    $scope.auth = Auth;
    $scope.passwordsMatch = true;

    /**
     * Processes the user registration form and adds the user to the Firebase database.
     */
    $scope.register = function() {
        // If the password and confirm password fields match
        if ($scope.password == $scope.confirmPassword) {
            // TODO Add password strength check?

            // Create a user account in Firebase
            $scope.auth.$createUserWithEmailAndPassword($scope.email, $scope.password, function(error) {
                // If there is an error, print
                if (error) console.error(error);
        
                // Change page to application
                $location.path("applications");
            });
        }
        // If the passwords don't match
        else {
            // Show the password mismatch alert
            $scope.passwordsMatch = false;

            // Reset password fields
            $scope.password = "";
            $scope.confirmPassword = "";
        }
    };

    /**
     * Checks if the user is already logged in, and redirects to the applications view if it is.
     */
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) $location.path("applications");
    });
});

app.controller("ApplicationsCtrl", function ($scope, $location, $firebaseObject, Auth) {
    $scope.auth = Auth;
    
    /**
     * Listens for auth state and sets user variable to it.
     */
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
        // If the user is defined, calculate application progress
        if (firebaseUser) {
            // Save the user object to scope if session has a login
            $scope.user = firebaseUser;

            // Connect to the user's portion of the database
            var userRef = firebase.database().ref().child($scope.user.uid);
            var obj = $firebaseObject(userRef);

            /**
             * Calculate the progress of the each of the user's applications.
             */
            obj.$loaded(function() {
                $scope.startedEO = obj.eo;

                if ($scope.startedEO) {
                    $scope.eoInputsFilled = Object.keys(obj.eo).length;
                    $scope.eoTotalInputs = 15;
                }
            });
        }
        // Redirect to login page if not authenticated
        else
            $location.path("login");
    });

    /**
     * Logs the user out of the application view and go back to home.
     */
    $scope.logout = function () {
        // Sign out of Firebase
        $scope.auth.$signOut();
    };
});

/**
 * Handle the Login page logic.
 */
app.controller("LoginCtrl", function($scope, $location, Auth) {
    // Scope variables for login
    $scope.auth = Auth;
    $scope.errorMsg = "";

    /**
     * Processes the login form and authenticates via Firebase.
     */
    $scope.login = function() {
        // Log the user in
        $scope.auth.$signInWithEmailAndPassword($scope.email, $scope.password, function(error) {
            if (error) {
                // Display special error messages in alert
                if (error.code == "auth/wrong-password") 
                    $scope.errorMsg = "You have entered the wrong password.";
                else if (error.code == "auth/user-not-found") 
                    $scope.errorMsg = "No user exists under that email.";
                else if (error.code == "auth/weak-password")
                    $scope.errorMsg = "Your password should be at least 6 characters long";
                // Print the error in the console if is special case
                else
                    console.error(error);
            }
        });
    };

    /**
     * Checks if the user is already logged in, and redirects to the application view if it is.
     */
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        // If the user is defined
        if (firebaseUser) {
            // Go to the admin page
            if (firebaseUser.email == "admin@tecanal.org")
                $location.path("admin");
            // Redirect to applications page
            else
                $location.path("applications");
        }
    });
});

app.controller("InfoPageCtrl", function ($scope, Auth) {
    $scope.auth = Auth;

    /**
     * Listens for auth state and sets user variable to it.
     */
    $scope.auth.$onAuthStateChanged(function (firebaseUser) {
        // Save the user object to scope if session has a login
        if (firebaseUser)
            $scope.user = firebaseUser;
    });

    /**
     * Logs the user out of the application view and go back to home.
     */
    $scope.logout = function () {
        // Sign out of Firebase
        $scope.auth.$signOut();
    };
});

/**
 * Handle the EO application page logic.
 */
app.controller("EOApplicationCtrl", function ($scope, $location, $firebaseObject, $firebaseStorage, Auth) {
    // Scope variables for auth and form save
    $scope.auth = Auth;
    $scope.user = "";
    $scope.unbindObject = "";
    $scope.formData = {};

    // Scope variables for resume and file handing 
    $scope.hasResume = false;
    $scope.resumeURL = "";

    // If the application type is being changed and there is a previously bound object, unbind
    if ($scope.unbindObject) $scope.unbindObject();

    /**
    * Wait for the user to be defined to connect to the database.
    */
    $scope.$watch("user", function () {
        if ($scope.user) {
            // Connect to the database portion for the user
            var userRef = firebase.database().ref().child($scope.user.uid + "/eo");
            var obj = $firebaseObject(userRef);

            // Bind the database user reference to the form inputs to autosave
            obj.$bindTo($scope, "formData", function (unbind) {
                $scope.unbindObject = unbind;
            });

            // Create a storage connection for resume file
            var storageRef = firebase.storage().ref().child("resumes/" + $scope.user.uid + "/eo");
            $scope.storage = $firebaseStorage(storageRef);
        }
    });

    /**
     * Handle resume uploading to Firebase.
     */
    $scope.$watch('resume', function () {
        // If the resume file is defined
        if ($scope.resume) {
            // Check if the user has already uploaded a resume
            if ($scope.formData.resumeURL) {
                // Create a storage connection for resume file
                var storageRef = firebase.storage().ref().child("resumes/" + $scope.user.uid + "/" + $scope.formData.resumeName);
                $scope.storage = $firebaseStorage(storageRef);

                // Delete the old resume
                $scope.storage.$delete().then(function () {
                    var storageRef = firebase.storage().ref().child("resumes/" + $scope.user.uid + "/" + $scope.resume.name);
                    $scope.storage = $firebaseStorage(storageRef);

                    // When the file is done uploading, store the download URL
                    var uploadTask = $scope.storage.$put($scope.resume);
                    uploadTask.$complete(function (snapshot) {
                        $scope.formData.resumeURL = snapshot.downloadURL;
                    });
                });
            }
            else {
                // Create a storage connection for resume file
                var storageRef = firebase.storage().ref().child("resumes/" + $scope.user.uid + "/" + $scope.resume.name);
                $scope.storage = $firebaseStorage(storageRef);

                // When the file is done uploading, store the download URL
                var uploadTask = $scope.storage.$put($scope.resume);
                uploadTask.$complete(function (snapshot) {
                    $scope.formData.resumeName = $scope.resume.name;
                    $scope.formData.resumeURL = snapshot.downloadURL;
                });
            }
        }
    });

    /**
     * Listens for auth state and sets user variable to it.
     */
    $scope.auth.$onAuthStateChanged(function(firebaseUser) {
        // Save the user object to scope if session has a login
        if (firebaseUser)
            $scope.user = firebaseUser;
        // Redirect to login page if not authenticated
        else
            $location.path("login");
    });

    /**
     * Allows the user to delete their uploaded resume without having to replace it with something else.
     */
    $scope.deleteResume = function() {
        var storageRef = firebase.storage().ref().child("resumes/" + $scope.user.uid + "/" + $scope.formData.resumeName);
        $scope.storage = $firebaseStorage(storageRef);

        // Delete the resume from Firebase
        $scope.storage.$delete().then(function() {
            // Delete old resume info
            $scope.formData.resumeURL = "";
            $scope.formData.resumeName = "";
        });
    };

    /**
     * Show information about applications after the user has submitted theirs.
     */
    $scope.showSubmissionPage = function() {
        $("#myModal").modal('show');
    };

    /**
     * Logs the user out of the application view and go back to home.
     */
    $scope.logout = function() {
        // Sign out of Firebase
        $scope.auth.$signOut();
    };
});
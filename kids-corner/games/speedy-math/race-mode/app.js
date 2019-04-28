/* global $ */

var intAddDiffLevel = 0,
    intSubDiffLevel = 0,
    intMultDiffLevel = 0,
    intDivDiffLevel = 0,
    expDiffLevel = 0,
    sqDiffLevel = 0,
    decAddDiffLevel = 0,
    decSubDiffLevel = 0,
    decMultDiffLevel = 0,
    decDivDiffLevel = 0,
    ops = [],
    answer = 0,
    score = 0,
    time = 60,
    operation = "",
    numOne = 0,
    numTwo = 0,
    practiceMode = false,
    labels = ["Easy", "Medium", "Hard"],
    problem = "",
    lastProblem = "",
    numProblems = 0,
    totalNumProblems = 0,
    numIntAdd = 0,
    totalNumIntAdd = 0,
    numIntSub = 0,
    totalNumIntSub = 0,
    numIntMult = 0,
    totalNumIntMult = 0,
    numIntDiv = 0,
    totalNumIntDiv = 0,
    numExp = 0,
    totalNumExp = 0,
    numSq = 0,
    totalNumSq = 0,
    numDecAdd = 0,
    totalNumDecAdd = 0,
    numDecSub = 0,
    totalNumDecSub = 0,
    numDecMult = 0,
    totalNumDecMult = 0,
    numDecDiv = 0,
    totalNumDecDiv = 0,
    timerID = 0;
    
initializeSliders();

// Start the timer
function startTimer() {
    timerID = setInterval(function() {
        document.getElementById("info").innerHTML = "Score: " + score + " | Time: " + time--;
        if (time === 0)
            endGame();
    }, 1000);
}
 
function initializeSliders() {
     var sliderOps = ['intAdd', 'intSub', 'intMult', 'intDiv', 'exp', 'sq', 'decAdd', 'decSub', 'decMult', 'decDiv'];
     
     for (var op of sliderOps) {
        $('#' + op + 'Difficulty-slider').slider({
            range: "max",
            min: 1,
            max: labels.length,
            value: 1,
            slide: function(a, b) {
                $('#' + op + 'DiffLevel').val(b.value);
            } 
        });
     }
 }

function startGame() {
    // Get all checkboxes
    var inputs = document.getElementsByTagName("input");
    var advance = false;
    
    // Iterate through all checkboxes
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox")
            if (inputs[i].checked)
                advance = true;
    }
    
    // If there is a mode selected, generate a problem
    if (advance) {
        getOperations();
        getDiffLevels();
        startTimer();
        generateProblem();   
    }
    // If no modes are selected, do not advance
    else 
        return;
    
    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}

 function endGame() {
    document.getElementById("game").style.display = "none";
    document.getElementById("end").style.display = "";
    
    document.getElementById("score").innerHTML = score;
    document.getElementById("numProblems").innerHTML = numProblems;
    document.getElementById("numWrongProblems").innerHTML = totalNumProblems - numProblems;
    
    if (document.getElementById("wrongProblem").innerHTML != "")
        document.getElementById("wrong").style.display = "";
    
    makeAccuracyBars();
 }

 function goHome() {
    document.getElementById("end").style.display = "none";
    document.getElementById("start").style.display = "";
    
    // Reset the timer
    time = 60;
    clearInterval(timerID);
    
    // Uncheck all the modes
    $("input:checkbox").prop("checked", false); 
    
    // Clear the selected operations array
    ops = [];
    
    // Clear the generated accuracy bars
    $('#accuracyBars').html("");
    
    // Set everything back to zero
    score = 0;
    numProblems = totalNumProblems = 0;
    numIntAdd = totalNumIntAdd = 0, numIntSub = totalNumIntSub = 0, numIntMult = totalNumIntMult = 0, numIntDiv = totalNumIntDiv = 0;
    numExp = totalNumExp = 0, numSq = totalNumSq = 0;
    numDecAdd = totalNumDecAdd = 0, numDecSub = totalNumDecSub = 0, numDecMult = totalNumDecMult = 0, numDecDiv = totalNumDecDiv = 0;
    intAddDiffLevel = intSubDiffLevel = intMultDiffLevel = intDivDiffLevel = 0;
    expDiffLevel = sqDiffLevel = 0;
    decAddDiffLevel = decSubDiffLevel = decMultDiffLevel = decDivDiffLevel = 0;
    
    // Hide all the sliders
    var test = document.querySelectorAll("[id*='slider']");
    for (var el of test)
        el.parentNode.style.display = "none";
    
    // Reinitalize sliders
    initializeSliders();
 }

 function getOperations() {
    // Get all checkboxes
    var inputs = document.getElementsByTagName("input");
    
    // Iterate through all checkboxes
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == "checkbox")
            if (inputs[i].checked)
                ops.push(inputs[i].id);
    }
 }


function getDiffLevels() {
    intAddDiffLevel = $("#intAddDifficulty-slider").slider("value");
    intSubDiffLevel = $("#intSubDifficulty-slider").slider("value");
    intMultDiffLevel = $("#intMultDifficulty-slider").slider("value");
    intDivDiffLevel = $("#intDivDifficulty-slider").slider("value");
    expDiffLevel = $("#expDifficulty-slider").slider("value");
    sqDiffLevel = $("#sqDifficulty-slider").slider("value");
    decAddDiffLevel = $("#decAddDifficulty-slider").slider("value");
    decSubDiffLevel = $("#decSubDifficulty-slider").slider("value");
    decMultDiffLevel = $("#decMultDifficulty-slider").slider("value");
    decDivDiffLevel = $("#decDivDifficulty-slider").slider("value");
}

function makeAccuracyBars() {
    $("#accuracyBars").append('<h3 id="totalAccuracyHead" style="text-align: center">' + "Total Accuracy (" + numProblems + "/" + totalNumProblems + ")" + '</h3>');
    var acc = 100 * (numProblems / totalNumProblems).toFixed(2);
    $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="intAddAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    
    if (ops.includes("intAdd")) {
        // Add Int Add Acc Header
        $("#accuracyBars").append('<h3 id="intAddAccuracyHead" style="text-align: center">' + labels[intAddDiffLevel - 1] + " Addition Accuracy (" + numIntAdd + "/" + totalNumIntAdd + ")" +'</h3>');
        
        // Add Int Add PG Bar
        acc = 100 * (numIntAdd / totalNumIntAdd).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="intAddAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
    if (ops.includes("intSub")) {
        // Add Int Sub Acc Header
        $("#accuracyBars").append('<h3 id="intSubAccuracyHead" style="text-align: center">' + labels[intSubDiffLevel - 1] + " Subtraction Accuracy (" + numIntSub + "/" + totalNumIntSub + ")" +'</h3>');
        
        // Add Int Sub PG Bar
        acc = 100 * (numIntSub / totalNumIntSub).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="intSubAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
    if (ops.includes("intMult")) {
        // Add Int Div Acc Header
        $("#accuracyBars").append('<h3 id="intMultAccuracyHead" style="text-align: center">' + labels[intMultDiffLevel - 1] + " Multiplication Accuracy (" + numIntMult + "/" + totalNumIntMult + ")" +'</h3>');
         
        // Add Int Mult PG Bar
        acc = 100 * (numIntMult / totalNumIntMult).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="intMultAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
    if (ops.includes("intDiv")) {
        // Add Int Div Acc Header
        $("#accuracyBars").append('<h3 id="intAddAccuracyHead" style="text-align: center">' + labels[intDivDiffLevel - 1] + " Division Accuracy (" + numIntDiv + "/" + totalNumIntDiv + ")" +'</h3>');
        
        // Add Int Div PG Bar
        acc = 100 * (numIntDiv / totalNumIntDiv).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="intDivAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
    if (ops.includes("exp")) {
        // Add Int Div Acc Header
        $("#accuracyBars").append('<h3 id="expAccuracyHead" style="text-align: center">' + labels[expDiffLevel - 1] + " Exponent Accuracy (" + numExp + "/" + totalNumExp + ")" +'</h3>');
        
        // Add Int Div PG Bar
        acc = 100 * (numExp / totalNumExp).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="expAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
    if (ops.includes("sq")) {
        // Add Int Div Acc Header
        $("#accuracyBars").append('<h3 id="sqAccuracyHead" style="text-align: center">' + labels[sqDiffLevel - 1] + " Square Root Accuracy (" + numSq + "/" + totalNumSq + ")" +'</h3>');
        
        // Add Int Div PG Bar
        acc = 100 * (numSq / totalNumSq).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="sqAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
    if (ops.includes("decAdd")) {
        // Add Dec Add Acc Header
        $("#accuracyBars").append('<h3 id="decAddAccuracyHead" style="text-align: center">' + labels[decAddDiffLevel - 1] + " Decimal Addition Accuracy (" + numDecAdd + "/" + totalNumDecAdd + ")" +'</h3>');
        
        // Add Int Div PG Bar
        acc = 100 * (numDecAdd / totalNumDecAdd).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="decAddAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
        
    }
    if (ops.includes("decSub")) {
        // Add Dec Sub Acc Header
        $("#accuracyBars").append('<h3 id="decAddAccuracyHead" style="text-align: center">' + labels[decSubDiffLevel - 1] + " Decimal Subtraction Accuracy (" + numDecSub + "/" + totalNumDecSub + ")" +'</h3>');
        
        // Add Int Div PG Bar
        acc = 100 * (numDecSub / totalNumDecSub).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="decSubAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
        
    }
    if (ops.includes("decMult")) {
        // Add Dec Mult Acc Header
        $("#accuracyBars").append('<h3 id="decMultAccuracyHead" style="text-align: center">' + labels[decMultDiffLevel - 1] + " Decimal Multiplication Accuracy (" + numDecMult + "/" + totalNumDecMult + ")" +'</h3>');
        
        // Add Dec Mult PG Bar
        acc = 100 * (numDecMult / totalNumDecMult).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="decMultAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
        
    }
    if (ops.includes("decDiv")) {
        // Add Dec Div Acc Header
        $("#accuracyBars").append('<h3 id="decDivAccuracyHead" style="text-align: center">' + labels[decDivDiffLevel - 1] + " Decimal Division Accuracy (" + numDecDiv + "/" + totalNumDecDiv + ")" +'</h3>');
        
        // Add Dec Div PG Bar
        acc = 100 * (numDecDiv / totalNumDecDiv).toFixed(2);
        $('#accuracyBars').append('<div class="progress"> <div class="progress-bar progress-bar-success" id="decDivAccuracy" role="progressbar" aria-valuenow="' + acc + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + acc +'%"> ' + acc + '% </div>');   
    }
}

function generateProblem() {
     if (operation = Math.floor(Math.random() * ops.length), operation = ops[operation], "intAdd" == operation) {
         for (lastProblem = problem; lastProblem == problem;) numOne = Math.floor(Math.random() * (10 * intAddDiffLevel)), numTwo = Math.floor(Math.random() * (10 * intAddDiffLevel)), problem = numOne + " + " + numTwo + " = ??";
         answer = numOne + numTwo, document.getElementById("problem").innerHTML = problem;
     } else if ("intSub" == operation) {
         for (lastProblem = problem; lastProblem == problem;)
             for (numOne = Math.floor(Math.random() * (10 * intSubDiffLevel)), numTwo = Math.floor(Math.random() * (10 * intSubDiffLevel)), problem = numOne + " - " + numTwo + " = ??"; !(numOne - numTwo > 0);) numOne = Math.floor(Math.random() * (10 * intSubDiffLevel)), numTwo = Math.floor(Math.random() * (10 * intSubDiffLevel)), problem = numOne + " - " + numTwo + " = ??";
         answer = numOne - numTwo, document.getElementById("problem").innerHTML = problem;
     } else if ("intMult" == operation) {
         for (lastProblem = problem; lastProblem == problem;) numOne = Math.floor(Math.random() * (8 * intMultDiffLevel)), numTwo = Math.floor(Math.random() * (8 * intMultDiffLevel)), problem = numOne + " x " + numTwo + " = ??";
         answer = numOne * numTwo, document.getElementById("problem").innerHTML = numOne + " x " + numTwo + " = ??";
     } else if ("intDiv" == operation) {
         for (lastProblem = problem; lastProblem == problem;)
             for (numOne = Math.floor(Math.random() * (13 * intDivDiffLevel)), numTwo = Math.floor(Math.random() * (10 * intDivDiffLevel)), problem = numOne + " / " + numTwo + " = ??"; numOne % numTwo !== 0;) numOne = Math.floor(Math.random() * (13 * intDivDiffLevel)), numTwo = Math.floor(Math.random() * (10 * intDivDiffLevel)), problem = numOne + " / " + numTwo + " = ??";
         answer = numOne / numTwo, document.getElementById("problem").innerHTML = problem;
     } else if ("exp" == operation) {
         for (lastProblem = problem; lastProblem == problem;) numOne = Math.floor(Math.random() * (10 * expDiffLevel)), numTwo = Math.floor(Math.random() * (4 * expDiffLevel)), problem = numOne + "<sup>" + numTwo + "</sup> = ??";
         answer = Math.pow(numOne, numTwo), document.getElementById("problem").innerHTML = problem;
     } else if ("sq" == operation) {
         for (lastProblem = problem; lastProblem == problem;) numOne = Math.floor(Math.random() * (7 * sqDiffLevel)), numTwo = Math.pow(numOne, 2), problem = '&radic;<span style="text-decoration:overline;">&nbsp;' + numTwo + "&nbsp;</span>";
         answer = numOne, document.getElementById("problem").innerHTML = problem;
     } else if ("decAdd" == operation) {
         for (lastProblem = problem; lastProblem == problem;) numOne = (10 * Math.random() * decAddDiffLevel).toFixed(1), numTwo = (10 * Math.random() * decAddDiffLevel).toFixed(1), problem = numOne + " + " + numTwo + " = ??";
         answer = (parseFloat(numOne) + parseFloat(numTwo)).toFixed(1), document.getElementById("problem").innerHTML = problem;
     } else if ("decSub" == operation) {
         for (lastProblem = problem; lastProblem == problem;)
             for (numOne = (10 * Math.random() * decSubDiffLevel).toFixed(1), numTwo = (10 * Math.random() * decSubDiffLevel).toFixed(1), problem = numOne + " - " + numTwo + " = ??"; !(parseFloat(numOne) - parseFloat(numTwo) > 0);) numOne = (10 * Math.random() * decSubDiffLevel).toFixed(1), numTwo = (10 * Math.random() * decSubDiffLevel).toFixed(1), problem = numOne + " - " + numTwo + " = ??";
         answer = (parseFloat(numOne) - parseFloat(numTwo)).toFixed(1), document.getElementById("problem").innerHTML = problem;
     } else if ("decMult" == operation) {
         for (lastProblem = problem; lastProblem == problem;) numOne = (10 * Math.random() * decMultDiffLevel).toFixed(1), numTwo = Math.floor(10 * Math.random() * decMultDiffLevel), problem = numOne + " x " + numTwo + " = ??";
         answer = (parseFloat(numOne) * parseFloat(numTwo)).toFixed(1), document.getElementById("problem").innerHTML = problem;
     } else if ("decDiv" == operation) {
         for (lastProblem = problem; lastProblem == problem;)
             for (numOne = (10 * Math.random() * decMultDiffLevel).toFixed(1), numTwo = (10 * Math.random() * decMultDiffLevel).toFixed(1), problem = numOne + " / " + numTwo + " = ??";
                 (parseFloat(numOne) % parseFloat(numTwo)).toFixed(1) > 1e-5;) numOne = (14 * Math.random() * decMultDiffLevel).toFixed(1), numTwo = (7 * Math.random() * decMultDiffLevel).toFixed(1), problem = numOne + " / " + numTwo + " = ??";
         answer = (parseFloat(numOne) / parseFloat(numTwo)).toFixed(1), document.getElementById("problem").innerHTML = problem;
     }
 }

 function getMultiplier() {
    var a = 1;
     
    "intAdd" == operation ? a *= intAddDiffLevel : "intSub" == operation ? a *= intSubDiffLevel : "intMult" == operation ? a *= intMultDiffLevel : "intDiv" == operation ? a *= intDivDiffLevel : "exp" == operation ? a *= expDiffLevel : "sq" == operation ? a *= sqDiffLevel : "decAdd" == operation ? a *= decAddDiffLevel : "decSub" == operation ? a *= decSubDiffLevel : "decMult" == operation ? a *= decMultDiffLevel : "decDiv" == operation && (a *= decDivDiffLevel)
     
    return a;
 }

 function checkAnswer() {
    var a = document.getElementById("ans").value;
    if (operation.includes("dec") && !a.includes(".") && (a += ".0"), a.replace(/[,\/#!$%\^&\*;:{}+=\-_`~()]/g, "") == answer) {
        if (document.getElementById("ans").style.backgroundColor = "green", setTimeout(function() {
                document.getElementById("ans").style.backgroundColor = "";
                document.getElementById("ans").value = "";
            }, 300), !practiceMode) {
            var b = 1;
            b = getMultiplier(), document.getElementById("info").innerHTML = "Score: " + (score += 10 * b) + " | Time: " + time;
         }
         numProblems++, totalNumProblems++;
         "intAdd" == operation ? (numIntAdd++, totalNumIntAdd++) : "intSub" == operation ? (numIntSub++, totalNumIntSub++) : "intMult" == operation ? (numIntMult++, totalNumIntMult++) : "intDiv" == operation ? (numIntDiv++, totalNumIntDiv++) : "exp" == operation ? (numExp++, totalNumExp++) : "sq" == operation ? (numSq++, totalNumSq++) : "decAdd" == operation ? (numDecAdd++, totalNumDecAdd++) : "decSub" == operation ? (numDecSub++, totalNumDecSub++) : "decMult" == operation ? (numDecMult++, totalNumDecMult++) : "decDiv" == operation && (numDecDiv++, totalNumDecDiv++), generateProblem()
     } 
     else {
         if (document.getElementById("ans").style.backgroundColor = "red", setTimeout(function() {
                 document.getElementById("ans").style.backgroundColor = "", document.getElementById("ans").value = ""
             }, 500), totalNumProblems++, "intAdd" == operation ? totalNumIntAdd++ : "intSub" == operation ? totalNumIntSub++ : "intMult" == operation ? totalNumIntMult++ : "intDiv" == operation ? totalNumIntDiv++ : "exp" == operation ? totalNumExp++ : "sq" == operation ? totalNumSq++ : "decAdd" == operation ? totalNumDecAdd++ : "decSub" == operation ? totalNumDecSub++ : "decMult" == operation ? totalNumDecMult++ : "decDiv" == operation && totalNumDecDiv++, "intAdd" == operation) {
             var c = numOne + " + " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("intSub" == operation) {
             var c = numOne + " - " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("intMult" == operation) {
             var c = numOne + " * " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("intDiv" == operation) {
             var c = numOne + " / " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("exp" == operation) {
             var c = numOne + "<sup>" + numTwo + "</sup> = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("decAdd" == operation) {
             var c = numOne + " + " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("decSub" == operation) {
             var c = numOne + " - " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("decMult" == operation) {
             var c = numOne + " x " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         } 
         else if ("decDiv" == operation) {
             var c = numOne + " / " + numTwo + " = ??";
             $("#wrongProblem").append('<a href="#" class="list-group-item list-group-item-action"><h5 class="list-group-item-heading">' + c + '</h5> <p class="list-group-item-text"><b>Your Answer: </b>' + a + "<br> <b>Correct: </b>" + answer + "</p> </a>")
         }
     }
 }
     
 $("input[type='checkbox']").change(function() {
     "intAdd" == this.id && this.checked ? document.getElementById("intAddSlider").style.display = "" : "intAdd" != this.id || this.checked || (document.getElementById("intAddSlider").style.display = "none"), "intSub" == this.id && this.checked ? document.getElementById("intSubSlider").style.display = "" : "intSub" != this.id || this.checked || (document.getElementById("intSubSlider").style.display = "none"), "intMult" == this.id && this.checked ? document.getElementById("intMultSlider").style.display = "" : "intMult" != this.id || this.checked || (document.getElementById("intMultSlider").style.display = "none"), "intDiv" == this.id && this.checked ? document.getElementById("intDivSlider").style.display = "" : "intDiv" != this.id || this.checked || (document.getElementById("intDivSlider").style.display = "none"), "exp" == this.id && this.checked ? document.getElementById("expSlider").style.display = "" : "exp" != this.id || this.checked || (document.getElementById("expSlider").style.display = "none"), "sq" == this.id && this.checked ? document.getElementById("sqSlider").style.display = "" : "sq" != this.id || this.checked || (document.getElementById("sqSlider").style.display = "none"), "decAdd" == this.id && this.checked ? document.getElementById("decAddSlider").style.display = "" : "decAdd" != this.id || this.checked || (document.getElementById("decAddSlider").style.display = "none"), "decSub" == this.id && this.checked ? document.getElementById("decSubSlider").style.display = "" : "decSub" != this.id || this.checked || (document.getElementById("decSubSlider").style.display = "none"), "decMult" == this.id && this.checked ? document.getElementById("decMultSlider").style.display = "" : "decMult" != this.id || this.checked || (document.getElementById("decMultSlider").style.display = "none"), "decDiv" == this.id && this.checked ? document.getElementById("decDivSlider").style.display = "" : "decDiv" != this.id || this.checked || (document.getElementById("decDivSlider").style.display = "none")
 });
 
 document.getElementById("ans").addEventListener("keyup", function(a) {
     a.preventDefault(), 13 == a.keyCode && checkAnswer(), 32 == a.keyCode && (document.getElementById("ans").value = "", generateProblem());
 });
 
 
 var oneBig = 100 / (labels.length - 1);
 $.each(labels, function(a, b) {
     var c = oneBig;
     0 !== a && a !== labels.length - 1 || (c = oneBig / 2), $(".legend").append("<label style='width: " + c + "%'>" + b + "</laben>")
 });
var delay;
var firstRun = true;
var hasLocalStorage = false;

/**
* Handle the run code button click to run code for the first time.
*/
function runCode() {
    // Disable button because auto-run is now enabled
    var el = document.getElementById("runCode");
    el.disabled = true;
    el.innerHTML = "Auto-Run Enabled";

    // Run the user's code for the first time
    executeCode();

    // Attach an event listener 
    var editor = document.querySelector('.CodeMirror').CodeMirror;
    editor.on("change", function () {
        clearTimeout(delay);
        delay = setTimeout(executeCode, 300);

        if (hasLocalStorage)
            localStorage.setItem("code", editor.getValue());
    });
}

/**
 * Stop the animation in case it's giving you a headache.
 */
function stopAnimation() {
    // Re-enable the run code button to restart the animation
    document.getElementById("runCode").disabled = false;

    // Clear all intervals
    for (var i = 1; i < 999999; i++)
        window.clearInterval(i);
}

/**
 * Execute user's code.
 */
function executeCode() {
    // Clear all intervals if its an animation
    for (var i = 1; i < 999999; i++)
        window.clearInterval(i);

    // Get code from editor
    var editor = document.querySelector('.CodeMirror').CodeMirror;
    var code = editor.getValue();

    // Add code as a script to page + execute
    var script = document.createElement('script');
    try {
        // If its first time executing something
        if (firstRun) {
            // Add script tag
            script.appendChild(document.createTextNode(code));
            document.body.appendChild(script);
        }
        else {
            // Remove old code
            document.body.removeChild(document.body.lastChild);

            // Add new code
            script.appendChild(document.createTextNode(code));
            document.body.appendChild(script);
        }
                        
        firstRun = false;
    } catch (e) {
        script.text = code;
        document.body.appendChild(script);
    }
}

window.onload  = function() {
    // Create splitter panel
    $(".panel-left").resizable({
        handleSelector: ".splitter",
        resizeHeight: false
    });

    // Create CodeMirror editor
    var editor = CodeMirror(document.getElementById("editor"), {
        mode: "javascript",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        indentWithTabs: true,
        lineWrapping: true,
        autofocus: true,
        value: "var pic = new Mosaic(5, 5);\n\npic.setPixelColor(0, 0, 'black');",
        extraKeys: {
            "Ctrl-/": function(instance) { 
                commentSelection(true);
            },
        }      
    });

    // Test for localStorage capabilities
    try {
        var test = 'test';

        localStorage.setItem(test, test);
        localStorage.removeItem(test);

        hasLocalStorage = true;
    } catch(e) {
        hasLocalStorage = false;
    }

    // If the browser supports localStorage
    if (hasLocalStorage) {
        // Get CodeMirror instance
        var editor = document.querySelector('.CodeMirror').CodeMirror;

        // Check if the user has code saved before
        if (localStorage.getItem("code"))
            editor.setValue(localStorage.getItem("code"));
    }

    CodeMirror.commands["selectAll"](editor);
      
    function getSelectedRange() {
        return { from: editor.getCursor(true), to: editor.getCursor(false) };
    }
      
    function autoFormatSelection() {
        var range = getSelectedRange();
        editor.autoFormatRange(range.from, range.to);
    }
      
    function commentSelection(isComment) {
        var range = getSelectedRange();
        editor.commentRange(isComment, range.from, range.to);
    }
}();

/**
 * Capture console.log() calls and display them onscreen.
 */
(function() {
    var oldLog = console.log;
    console.log = function(message) {
        var consoleEl = document.getElementById("console");

        // Append value to the end if there is already log output
        if (consoleEl.value)
            consoleEl.value += "\n" + message;
        // Set the new value of log output
        else
            consoleEl.value = message;

        oldLog.apply(console, arguments);
    };
})();
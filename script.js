/**
 * SGA Voter's Guide
 * This script contains the logic for The Collegian's SGA Voter's Guide
 *
 * © 2017 Collegian Media Group. Written by George W. Walker <gwalker@collegiamedia.com>
 */


var candidateData; // Variable for storing candidate data.
var numQuestions; // Variable for storing the total number of questions.
var defaultMessage = "Select a candidate to learn about their goals."; // The message to display when a candidate is not selected.
var selected = getUrlParameter("name"); // Store the current tag in variable to load once data is loaded.

Promise.all([loadCandidateData("data.json")]).then(function(result) {
    candidateData = result[0];
    initializeLayout(defaultMessage);
    loadQuestions();
    if (selected) {
        loadCandidate(selected);
    }
});


jQuery(document).ready(function() {
    jQuery('.candidatelink').click(function() {
        var currentPage = document.location.toString().split('?')[0];
        document.location = currentPage + "?name=" + this.text;
        return false;
    });
});

/**
 * Creates DOM objects needed in the #candidate-view object.
 * @param {string} introMessage The message to display when no candidate is selected
 */
function initializeLayout(introMessage) {
    try {
        jQuery("#candidate-view").append("<h1 id='candidate-name'>" + introMessage + "</h1><div class='wrap hidden'><p id='candidate-yearandmajor'><i id='candidate-year'></i><i>, </i><i id='candidate-major'></i></p><div id='candidate-photo-wrap'><img id='candidate-photo' src=''></div><div id='candidate-questions'></div></div><div id='candidate-seperator'></div>");
    } catch (err) {
        catchErr("An error occurred loading the page. Please try again later.", err, true);
    }
}


/**
 * Loads the candidate file into a variable
 * @param {string} filename The filename of the data file
 */
function loadCandidateData(filename) {
    try {
        return new Promise(function(resolve, reject) {
            jQuery.getJSON(filename, function(json) {
                resolve(json);
            });
        });
    } catch (err) {
        catchErr("Error loading data.", err, true);
    }
}

/**
 * Function that displays a particular candidate
 * @param {string} name
 */
function loadCandidate(name) {
    try {
        if (!candidateData) {
            throw "DataNotLoaded";
        }
        jQuery('#candidate-year').text(candidateData.Responses[name].grade);
        jQuery('#candidate-major').text(candidateData.Responses[name].major);
        jQuery('#candidate-photo').attr('src', candidateData.Responses[name].photoURL);
        jQuery('#candidate-name').text(name);

        // Load the question answers
        for (var i = 1; i <= numQuestions; i++) {
          jQuery('.answer' + i).text(candidateData.Responses[name].questions[i]);
        }

        // Unhide the top area
        jQuery('.wrap').removeClass('hidden');

        // Mark candidate view as visible
        jQuery('#candidate-view').addClass("visible");

        // Scroll to the candidate view
        jQuery("html, body").animate({
            scrollTop: $("#candidate-name").offset().top - 20
        }, 600);
    } catch (err) {
        if (err == "DataNotLoaded") {
            catchErr("Data file not done loading. Please retry.", err, true);
        } else {
            catchErr(name + " not found in data file.", err, true);
        }
    }
}


/**
 * Loads the questions from the data file and creates DOM objects for them.
 */
function loadQuestions() {
    try {
        counter = 0;
        jQuery.each(candidateData.Questions, function() {
            counter++;
            jQuery("#candidate-questions").append("<div class='question question" + counter + "'>" + this + "</div><div class='answer answer" + counter + "'></div>");
        });
        numQuestions = counter;
    } catch (err) {
        catchErr("Unable to load questions from data file.", err, true);
    }
}

/**
 * Function that displays a particular candidate
 * @param {string} message The error message that can be displayed to the user. Can be null.
 * @param {string} details Details that will be helpful to a developer. These are displayed in the console.
 * @param {bool} shouldAlert Set to true to create an alert dialog for the user, false if the error
 */
function catchErr(message, details, shouldAlert) {
    if (!(message)) {
        message = "Unkown error."
    }
    if (shouldAlert) {
        alert("An error occurred. Please try again later. If this error persists, please contact us.\n\nError Details:\n" + message);
    }
    console.log(details);
}

/**
 * Function to get a parameter's data out of the URL.
 * Source: http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
 * @param {string} sParam The parameter to get out of the url.
 * @returns {string} returns the parameter's data
 */
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

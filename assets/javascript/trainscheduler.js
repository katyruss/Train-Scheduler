$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyCHKyi027hPQVzoypJbNzvI77ssG_-VAQM",
        authDomain: "train-scheduler-5d8f1.firebaseapp.com",
        databaseURL: "https://train-scheduler-5d8f1.firebaseio.com",
        projectId: "train-scheduler-5d8f1",
        storageBucket: "train-scheduler-5d8f1.appspot.com",
        messagingSenderId: "76771511967",
        appId: "1:76771511967:web:ad766075c01feb0e"
    };

    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();


    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        var trainName = $("#train-name-input")
            .val()
            .trim();
        var destination = $("destination-input")
            .val()
            .trim();
        var firstTrain = $("first-train-input")
            .val()
            .trim();
        var frequency = $("#frequency-input")
            .val()
            .trim();

        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        };

        trainData.ref().push(newTrain);

        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.firstTrain);
        console.log(newTrain.frequency);

        alert("Train successfully added");
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#first-train-input").val("");
        $("#frequency-input").val("");

    });

    trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());

        var tName = childSnapshot.val().name;
        var tDestination = childSnapshot.val().destination;
        var tFrequency = childSnapshot.val().frequency;
        var tFirstTrain = childSnapshot.val().firstTrain;

        var timeArr = tFirstTrain.split(":");
        var trainTime = moment()
            .hours(timeArr[0])
            .minutes(timeArr[1]);
        var maxMoment = moment.max(moment(), trainTime);
        var tMinutes;
        var tArrival;

        if (maxMoment === trainTime) {
            tArrival = trainTime.format("hh:mm A");
            tMinutes = trainTime.diff(moment(), "minutes");
        } else {

            var differenceTimes = moment().diff(trainTime, "minutes");
            var tRemainder = differenceTimes % tFrequency;
            tMinutes = tFrequency - tRemainder;

            tArrival = moment()
                .add(tMinutes, "m")
                .format("hh:mm A");
        }
        console.log("tMinutes:", tMinutes);
        console.log("tArrival:", tArrival);


        $("#train-table > tbody").append(
            $("<tr>").append(
                $("<td>").text(tName),
                $("<td>").text(tDestination),
                $("<td>").text(tFrequency),
                $("<td>").text(tArrival),
                $("<td>").text(tMinutes)
            )
        );
    })
});
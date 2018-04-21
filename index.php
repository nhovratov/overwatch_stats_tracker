<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" lang="de">
    <title>Overwatch Match History</title>
    <link href="/css/contrib/bootstrap.min.css" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet">
    <script src="/js/contrib/vue.min.js"></script>
    <script src="/js/contrib/moment.min.js"></script>
    <script src="/js/script.js" async=""></script>
</head>
<body class="pt-4">
<div id="app">
    <div class="container">
        <h1>Overwatch Match History (Ranked)</h1>
        <label for="newMatch">Match hinzufügen</label><small class="ml-2" v-if="!isSaved">(Ungesicherte Änderungen: {{notSavedEntriesCount}})</small>
        <div class="matchbox d-flex mb-4">
            <input id="newMatch" class="form-control mr-4" v-model="newMatch" v-on:keyup.enter="pushEntry">
            <button v-on:click="saveEntryWithButton" class="btn btn-primary">Abspeichern</button>
        </div>
        <div class="ow-history" v-for="(week, indexOuter) in chunkedMonths">
            <h2>{{week.week}} ({{week.difference | change}})</h2>
            <table class="table table-sm">
                <thead>
                <tr>
                    <th style="width: 33.333%">Punkte</th>
                    <th style="width: 33.333%">Änderung</th>
                    <th style="width: 33.333%">Uhrzeit</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(match, index) in week.matches">
                    <td v-bind:class="rankTier(match)">{{match.points}}<img v-bind:src="rankTier(match) | imagesrc"/>
                    </td>
                    <td v-bind:class="changeClass(match)">{{match.change | change}}<button
                                v-if="indexOuter == 0 && index == 0" v-on:click="removeLastEntry" class="btn btn-danger btn-sm remove">Löschen</button>
                    </td>
                    <td v-bind:class="dateClass(match)">{{formatDate(match.date)}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>

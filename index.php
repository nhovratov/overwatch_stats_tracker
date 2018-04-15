<?php
$mysqli = new mysqli('localhost', 'nikita', 'dev', 'nele_overwatch');
$mysqli->set_charset('utf8');
$json = $mysqli->query("SELECT json FROM match_history WHERE id_match = 1")->fetch_assoc()['json'];
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" lang="de">
    <title>Overwatch Match History</title>
    <link href="/css/contrib/bootstrap.min.css" rel="stylesheet">
    <script src="/js/contrib/vue.min.js"></script>
    <script src="/js/contrib/moment.min.js"></script>
    <script src="/js/script.js" async=""></script>
</head>
<body class="pt-4">
<div id="app">
    <div class="container">
        <h1>Overwatch Match History (Ranked)</h1>
        <label for="newMatch">Match hinzufügen</label>
        <input id="newMatch" class="form-control" v-model="newMatch" v-on:keyup.enter="pushEntry">
        <form id="saving" method="post" action="/php/database.php" class="mt-4 mb-4">
            <input type="hidden" value="" name="history">
            <input type="submit" value="abspeichern" class="btn btn-primary">
        </form>
        <div class="ow-history">
            <table class="table">
                <thead>
                <tr>
                    <th>Punkte</th>
                    <th>Änderung</th>
                    <th>Uhrzeit</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(match, index) in history">
                    <td>{{match.points}}</td>
                    <td v-bind:class="changeClass(match)">{{match.change}}</td>
                    <td>{{formatDate(match.date)}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script>
    var jsonHistory = <?=$json?>
</script>
</body>
</html>

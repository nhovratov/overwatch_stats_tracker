<?php
$mysqli = new mysqli('localhost', 'nikita', 'dev', 'nele_overwatch');
$mysqli->set_charset('utf8');

if (isset($_POST['history']) && $_POST['history'] !== '') {
    $json = $_POST['history'];
    $mysqli->query("UPDATE match_history SET json = '$json' WHERE id_match = 1");
    echo "Deine Matchhistory wurde gespeichert <3";
}

header('Location: /');

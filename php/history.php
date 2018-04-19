<?php
$mysqli = new mysqli('localhost', 'nikita', 'dev', 'nele_overwatch');
$mysqli->set_charset('utf8');
echo $mysqli->query("SELECT json FROM match_history WHERE id_match = 1")->fetch_assoc()['json'];

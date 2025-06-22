<!DOCTYPE html>
<html lang="da">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flight Tracker</title>
    <link rel="stylesheet" type="text/css" href="./styles/style.css">
</head>

<body>
    <h1><a href="index.php"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-plane-icon lucide-plane">
                <path
                    d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg> Flight Tracking</a></h1>
    <form action="index.php" method="GET" class="search-form">
        <label>
            <strong>From:</strong>
            <input type="text" name="departingAirport" list="airport-codes" placeholder="e.g., LAX">
        </label>

        <label>
            <strong>To:</strong>
            <input type="text" name="arrivingAirport" list="airport-codes" placeholder="e.g., HND">
        </label>

        <input type="submit" value="Search">
        <datalist id="airport-codes">
            <option value="AMS">AMS</option>
            <option value="BKK">BKK</option>
            <option value="CDG">CDG</option>
            <option value="CPH">CPH</option>
            <option value="CTS">CTS</option>
            <option value="DEL">DEL</option>
            <option value="DXB">DXB</option>
            <option value="FRA">FRA</option>
            <option value="HKG">HKG</option>
            <option value="HND">HND</option>
            <option value="ICN">ICN</option>
            <option value="JFK">JFK</option>
            <option value="KIX">KIX</option>
            <option value="KUL">KUL</option>
            <option value="LAX">LAX</option>
            <option value="LHR">LHR</option>
            <option value="NRT">NRT</option>
            <option value="PEK">PEK</option>
            <option value="PVG">PVG</option>
            <option value="SIN">SIN</option>
        </datalist>
    </form>


</body>

<?php
require_once 'db.php';

$departingAirport = $_GET['departingAirport'] ?? '';
$arrivingAirport = $_GET['arrivingAirport'] ?? '';


$query = "SELECT * FROM flights WHERE 1=1";
$params = [];

if (!empty($departingAirport)) {
    $query .= " AND (departure_airport = :departingAirport)";
    $params[':departingAirport'] = strtoupper($departingAirport);
}

if (!empty($arrivingAirport)) {
    $query .= " AND (arrival_airport = :arrivingAirport)";
    $params[':arrivingAirport'] = strtoupper($arrivingAirport);
}


$stmt = $pdo->prepare($query);
$stmt->execute($params);

if (!empty($arrivingAirport) or !empty($departingAirport)) {
    while ($flight = $stmt->fetch()) {

        echo '<div class="flight-entry">';
        echo "<strong>Flight:</strong> {$flight['flight_number']}<br>";
        echo "<strong>Departure:</strong> {$flight['departure_airport']} at {$flight['departure_time']}<br>";
        echo "<strong>Arrival:</strong> {$flight['arrival_airport']} at {$flight['arrival_time']}<br>";
        echo "</div>";
    }
}

?>
<footer>
    @ FT
</footer>
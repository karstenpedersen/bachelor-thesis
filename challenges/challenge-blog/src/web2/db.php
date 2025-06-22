<?php
try {
    $pdo = new PDO('sqlite::memory:');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $files = [
        'data/flights_data.csv'
    ];

    // Create the flights table
    $pdo->exec("
        CREATE TABLE flights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flight_number TEXT,
            departure_airport TEXT,
            departure_time STRING,
            arrival_airport TEXT,
            arrival_time TEXT
        );
    ");

    foreach ($files as $filename) {
        if (!file_exists($filename)) {
            throw new Exception("CSV file not found: $filename");
        }


        $file = fopen($filename, 'r');
        if ($file === false) {
            throw new Exception("CSV file not found.");
        }

        fgetcsv($file, 1000, ",", '"', "\\");

        $stmt = $pdo->prepare("
        INSERT INTO flights (flight_number, departure_airport, departure_time, arrival_airport, arrival_time)
        VALUES (?, ?, ?, ?, ?)
    ");

        while (($row = fgetcsv($file, 1000, ",", '"', "\\")) !== false) {
            $stmt->execute($row);
        }

        fclose($file);

    }

} catch (Exception $e) {
    die('Error: ' . $e->getMessage());
}
?>
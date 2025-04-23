<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$database = "bk_pfic_new";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

$search = $conn->real_escape_string($_GET['search'] ?? '');
$gene = $conn->real_escape_string($_GET['gene'] ?? '');

if (empty($search) || empty($gene)) {
    die(json_encode(['error' => 'Search and gene parameters are required']));
}

$table = strtolower($gene);

$sql = "SELECT Gene, Pop, HGVS_NP, dbSNP, ACMG_Classification 
        FROM $table 
        WHERE (Gene LIKE '%$search%' 
        OR Pop LIKE '%$search%'  
        OR dbSNP LIKE '%$search%' 
        OR ACMG_Classification LIKE '%$search%' 
        OR HGVS_NP LIKE '%$search%'
        
        )
        AND Gene = '$gene'";

$result = $conn->query($sql);

if ($result === false) {
    die(json_encode(['error' => 'Error executing query: ' . $conn->error]));
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['data' => $data, 'total' => count($data)]);

$conn->close();
?>
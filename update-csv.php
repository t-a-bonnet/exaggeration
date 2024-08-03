<?php
// update_csv.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the input data
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['row']) && isset($data['text'])) {
        $rowIndex = intval($data['row']);
        $newText = $data['text'];

        // Load the CSV file
        $csvFile = 'sampled_climate_data.csv';
        $rows = array_map('str_getcsv', file($csvFile));
        
        // Update the row
        if (isset($rows[$rowIndex + 1])) {
            $rows[$rowIndex + 1][0] = $newText; // Assuming 'body_parent' is the first column after the header
            $fp = fopen($csvFile, 'w');
            foreach ($rows as $row) {
                fputcsv($fp, $row);
            }
            fclose($fp);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Row not found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
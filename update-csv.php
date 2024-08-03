<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log('POST request received');

    // Read the input data
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['row']) && isset($data['text'])) {
        error_log('Valid data received');
        
        $rowIndex = intval($data['row']);
        $newText = $data['text'];

        // Path to the CSV file
        $csvFile = 'sampled_climate_data.csv';
        
        if (!file_exists($csvFile)) {
            error_log('CSV file does not exist');
            echo json_encode(['success' => false, 'message' => 'CSV file does not exist']);
            exit;
        }

        // Load CSV file and convert it to an array
        $rows = array_map('str_getcsv', file($csvFile));

        // Update the row
        if (isset($rows[$rowIndex + 1])) {
            $rows[$rowIndex + 1][0] = $newText; // Update the specific column (assumes body_parent is in the first column)

            // Write updated data back to CSV file
            $fp = fopen($csvFile, 'w');
            foreach ($rows as $row) {
                fputcsv($fp, $row);
            }
            fclose($fp);

            echo json_encode(['success' => true]);
        } else {
            error_log('Row not found');
            echo json_encode(['success' => false, 'message' => 'Row not found']);
        }
    } else {
        error_log('Invalid data');
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
    }
} else {
    error_log('Method not allowed');
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
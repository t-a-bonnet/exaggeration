<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Unknown error'];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $inputData = file_get_contents('php://input');
        $data = json_decode($inputData, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $response['message'] = 'Invalid JSON data: ' . json_last_error_msg();
        } elseif (isset($data['row']) && isset($data['text'])) {
            $rowIndex = intval($data['row']);
            $newText = $data['text'];
            $csvFile = 'sampled_climate_data.csv';

            if (!file_exists($csvFile)) {
                $response['message'] = 'CSV file does not exist';
            } else {
                $rows = array_map('str_getcsv', file($csvFile));
                if (isset($rows[$rowIndex + 1])) {
                    $rows[$rowIndex + 1][0] = $newText;

                    $fp = fopen($csvFile, 'w');
                    foreach ($rows as $row) {
                        fputcsv($fp, $row);
                    }
                    fclose($fp);

                    $response['success'] = true;
                    $response['message'] = 'Update successful';
                } else {
                    $response['message'] = 'Row not found';
                }
            }
        } else {
            $response['message'] = 'Invalid data';
        }
    } else {
        http_response_code(405);
        $response['message'] = 'Method not allowed';
    }
} catch (Exception $e) {
    $response['message'] = 'Exception: ' . $e->getMessage();
}

echo json_encode($response);
?>
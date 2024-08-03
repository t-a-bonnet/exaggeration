<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// Retrieve the GitHub token from the environment variable
$githubToken = getenv('GITHUB_TOKEN');

// Repository details
$owner = 't-a-bonnet';
$repo = 'exaggeration';
$path = 'sampled_climate_data.csv'; // Path to your file in the repo

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

            // GitHub API URL to get the current file content and SHA
            $getFileUrl = "https://api.github.com/repos/$owner/$repo/contents/$path";

            // Initialize cURL to get file content
            $ch = curl_init($getFileUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                "Authorization: token $githubToken",
                "User-Agent: PHP Script"
            ]);
            $responseContent = curl_exec($ch);
            if ($responseContent === false) {
                $response['message'] = 'Error fetching file: ' . curl_error($ch);
                curl_close($ch);
                echo json_encode($response);
                exit;
            }
            curl_close($ch);

            $fileData = json_decode($responseContent, true);
            if (!isset($fileData['sha'])) {
                $response['message'] = 'File SHA not found';
                echo json_encode($response);
                exit;
            }

            $sha = $fileData['sha'];
            $currentContent = base64_decode($fileData['content']);
            $rows = array_map('str_getcsv', explode("\n", $currentContent));
            if (isset($rows[$rowIndex + 1])) {
                $rows[$rowIndex + 1][0] = $newText;

                // Convert the updated rows back to CSV format
                $updatedContent = "";
                foreach ($rows as $row) {
                    $updatedContent .= implode(',', $row) . "\n";
                }

                // Prepare data for update
                $updateData = json_encode([
                    'message' => 'Update CSV file via API',
                    'content' => base64_encode($updatedContent),
                    'sha' => $sha
                ]);

                // GitHub API URL to update the file
                $updateFileUrl = "https://api.github.com/repos/$owner/$repo/contents/$path";

                // Initialize cURL to update file
                $ch = curl_init($updateFileUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                curl_setopt($ch, CURLOPT_POSTFIELDS, $updateData);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'Authorization: token ' . $githubToken,
                    'User-Agent: PHP Script',
                    'Content-Type: application/json'
                ]);
                $updateResponse = curl_exec($ch);
                if ($updateResponse === false) {
                    $response['message'] = 'Error updating file: ' . curl_error($ch);
                    curl_close($ch);
                    echo json_encode($response);
                    exit;
                }
                curl_close($ch);

                $updateData = json_decode($updateResponse, true);
                if (isset($updateData['commit'])) {
                    $response['success'] = true;
                    $response['message'] = 'File updated successfully';
                } else {
                    $response['message'] = 'Failed to update file';
                }
            } else {
                $response['message'] = 'Row not found';
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
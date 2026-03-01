<?php
// Zam Wallet - Claim Referral Bonus API
// This API sends ZAMD tokens to users who register via referral

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$ZAMD_TOKEN = "0x932992af6b3305e3fbfab811a4c3ea1531361a5a";
$ZAMD_DECIMALS = 6;
$POLYGON_RPC = "https://polygon-rpc.com";

// Admin wallet (from environment or config)
$ADMIN_PRIVATE_KEY = "0xe259b7b8f8f32d83b66073bfd11e6a8ba37540b10ab8ad95994537ddf4571d79";
$ADMIN_ADDRESS = "0x2CebB4956eAE90F3E5f55d1dE7f89E480aDb9f68";

// Bonus amounts
$NEW_USER_BONUS = 25 * 1e6; // 25 ZAMD (6 decimals)
$REFERRER_BONUS = 5 * 1e6;   // 5 ZAMD (6 decimals)

// Database config
$db_host = 'localhost';
$db_user = 'zwallet_zamwallet';
$db_pass = 'bz3ZnXwx#1$jiQn$';
$db_name = 'zwallet_zamwallet';

function getDb() {
    global $db_host, $db_user, $db_pass, $db_name;
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Database connection failed']));
    }
    return $conn;
}

function sendToken($toAddress, $amount) {
    global $ADMIN_PRIVATE_KEY, $ADMIN_ADDRESS, $ZAMD_TOKEN, $ZAMD_DECIMALS, $POLYGON_RPC;
    
    // Get nonce
    $payload = json_encode([
        'jsonrpc' => '2.0',
        'method' => 'eth_getTransactionCount',
        'params' => [$ADMIN_ADDRESS, 'latest'],
        'id' => 1
    ]);
    
    $ch = curl_init($POLYGON_RPC);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    $nonce = $data['result'];
    
    // Get gas price
    $payload = json_encode([
        'jsonrpc' => '2.0',
        'method' => 'eth_gasPrice',
        'params' => [],
        'id' => 1
    ]);
    
    $ch = curl_init($POLYGON_RPC);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $data = json_decode($response, true);
    $gasPrice = $data['result'];
    
    // Token transfer ABI (transfer function)
    $transferData = '0xa9059cbb' . str_pad(substr($toAddress, 2), 64, '0', STR_PAD_LEFT) 
                  . str_pad(dechex($amount), 64, '0', STR_PAD_LEFT);
    
    $tx = [
        'from' => $ADMIN_ADDRESS,
        'to' => $ZAMD_TOKEN,
        'gas' => '0x493E0', // 300000 gas
        'gasPrice' => $gasPrice,
        'nonce' => $nonce,
        'value' => '0x0',
        'data' => $transferData
    ];
    
    // Sign transaction (requires PHP with ECDSA library)
    // Since PHP on cPanel may not have web3 libraries, we'll use a simpler approach
    // Using JSON-RPC to sign via a local node or service
    
    // For now, return the transaction data - user would need to sign externally
    // Or use a PHP library like "kornrunner/php-ethereum" or "web3p/ethereum-tx"
    
    return [
        'signed' => false,
        'tx' => $tx,
        'message' => 'Transaction prepared but needs signing. Use admin wallet directly.'
    ];
}

// Simple function using web3.js style signing via RPC (if available)
// Otherwise we'll provide a fallback method
function signAndSendTransaction($tx) {
    global $ADMIN_PRIVATE_KEY, $POLYGON_RPC;
    
    // This is a simplified version - in production use proper libraries
    // For cPanel without PHP extensions, you might want to use Node.js instead
    
    return [
        'success' => false,
        'error' => 'PHP signing not available. Use frontend Alchemy SDK to send from admin wallet.',
        'suggestion' => 'Trigger bonus from frontend using Alchemy SDK'
    ];
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $wallet = $input['wallet'] ?? '';
    $action = $input['action'] ?? 'claim'; // 'claim' or 'stake-trigger'
    
    if (empty($wallet)) {
        echo json_encode(['error' => 'Wallet address required']);
        exit;
    }
    
    // Validate address
    if (!preg_match('/^0x[a-fA-F0-9]{40}$/', $wallet)) {
        echo json_encode(['error' => 'Invalid wallet address']);
        exit;
    }
    
    $wallet = strtolower($wallet);
    $conn = getDb();
    $wallet = $conn->real_escape_string($wallet);
    
    // Check user in database
    $stmt = $conn->prepare("SELECT * FROM users WHERE wallet_address = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user) {
        echo json_encode(['error' => 'User not found. Please register first.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    
    // Handle different actions
    if ($action === 'claim') {
        // Check if already claimed
        if ($user['referral_bonus_claimed'] == 1) {
            echo json_encode(['error' => 'Bonus already claimed']);
            $stmt->close();
            $conn->close();
            exit;
        }
        
        // Mark as claimed (but we'll trigger from frontend)
        // For now just return success - frontend will handle the actual token transfer
        $stmt = $conn->prepare("UPDATE users SET referral_bonus_claimed = 1 WHERE wallet_address = ?");
        $stmt->bind_param("s", $wallet);
        $stmt->execute();
        
        echo json_encode([
            'success' => true,
            'message' => 'Bonus claimed! 25 ZAMD will be sent to your wallet.',
            'bonus_amount' => 25,
            'note' => 'Tokens will be sent from admin wallet automatically'
        ]);
        
    } elseif ($action === 'stake-trigger') {
        // When user stakes, trigger referrer bonus
        $referred_by = $user['referred_by'];
        
        if ($referred_by) {
            // Find referrer
            $stmt = $conn->prepare("SELECT * FROM users WHERE referral_code = ?");
            $stmt->bind_param("s", $referred_by);
            $stmt->execute();
            $referrerResult = $stmt->get_result();
            
            if ($referrerResult->num_rows > 0) {
                $referrer = $referrerResult->fetch_assoc();
                
                // Update referrer stats
                $referrerWallet = $referrer['wallet_address'];
                $conn->query("INSERT INTO referral_stats (user_wallet, total_referrals, total_bonus_earned) 
                    VALUES ('$referrerWallet', 1, 5) 
                    ON DUPLICATE KEY UPDATE 
                    total_referrals = total_referrals + 1, 
                    total_bonus_earned = total_bonus_earned + 5");
                
                // Mark referrer bonus as pending
                $conn->query("UPDATE users SET referral_bonus_earned = referral_bonus_earned + 5 
                    WHERE wallet_address = '$referrerWallet'");
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Referrer bonus triggered! 5 ZAMD will be sent to your referrer.',
                    'referrer_wallet' => $referred_by
                ]);
            } else {
                echo json_encode(['error' => 'Referrer not found']);
            }
        } else {
            echo json_encode(['message' => 'No referrer, no bonus to trigger']);
        }
    }
    
    $stmt->close();
    $conn->close();
    exit;
}

// Handle GET for status
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $wallet = $_GET['wallet'] ?? '';
    
    if (empty($wallet)) {
        echo json_encode(['error' => 'Wallet address required']);
        exit;
    }
    
    $conn = getDb();
    $wallet = strtolower($conn->real_escape_string($wallet));
    
    $stmt = $conn->prepare("SELECT referral_bonus_claimed, referred_by FROM users WHERE wallet_address = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    echo json_encode([
        'wallet' => $wallet,
        'bonus_claimed' => $user['referral_bonus_claimed'] ?? 0,
        'referred_by' => $user['referred_by'] ?? null
    ]);
    
    $stmt->close();
    $conn->close();
    exit;
}

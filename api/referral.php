<?php
// Zam Wallet Referral API
// Host this on your cPanel server

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$db_host = 'localhost';
$db_user = 'zwallet_zamwallet';
$db_pass = 'bz3ZnXwx#1$jiQn$';
$db_name = 'zwallet_zamwallet';

function getDb() {
    global $db_host, $db_user, $db_pass, $db_name;
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
    return $conn;
}

function generateReferralCode() {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $code = 'ZAM';
    for ($i = 0; $i < 6; $i++) {
        $code .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $code;
}

// Handle GET request - get user info
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $wallet = $_GET['wallet'] ?? '';
    
    if (empty($wallet)) {
        echo json_encode(['error' => 'Wallet address required']);
        exit;
    }
    
    $conn = getDb();
    $wallet = strtolower($conn->real_escape_string($wallet));
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE wallet_address = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Create new user
        $referralCode = generateReferralCode();
        $stmt = $conn->prepare("INSERT INTO users (wallet_address, referral_code) VALUES (?, ?)");
        $stmt->bind_param("ss", $wallet, $referralCode);
        $stmt->execute();
        
        // Get the new user
        $stmt = $conn->prepare("SELECT * FROM users WHERE wallet_address = ?");
        $stmt->bind_param("s", $wallet);
        $stmt->execute();
        $result = $stmt->get_result();
    }
    
    $user = $result->fetch_assoc();
    
    // Get stats
    $stmt = $conn->prepare("SELECT * FROM referral_stats WHERE user_wallet = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $statsResult = $stmt->get_result();
    $stats = $statsResult->fetch_assoc();
    
    // Get settings
    $settingsResult = $conn->query("SELECT * FROM referral_settings");
    $settings = [];
    while ($row = $settingsResult->fetch_assoc()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    
    echo json_encode([
        'success' => true,
        'user' => [
            'wallet_address' => $user['wallet_address'],
            'referral_code' => $user['referral_code'],
            'referred_by' => $user['referred_by'],
            'referral_bonus_earned' => floatval($user['referral_bonus_earned'] ?? 0),
            'referral_bonus_staked' => floatval($user['referral_bonus_staked'] ?? 0),
        ],
        'stats' => [
            'total_referrals' => intval($stats['total_referrals'] ?? 0),
            'total_bonus_earned' => floatval($stats['total_bonus_earned'] ?? 0),
        ],
        'settings' => [
            'new_user_bonus' => floatval($settings['new_user_bonus'] ?? 25),
            'referrer_bonus' => floatval($settings['referrer_bonus'] ?? 5),
            'min_stake_amount' => floatval($settings['min_stake_amount'] ?? 25),
            'active' => $settings['active'] ?? '1',
        ],
    ]);
    
    $stmt->close();
    $conn->close();
}

// Handle POST request - register with referral code
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $wallet = $input['wallet'] ?? '';
    $referralCode = $input['referralCode'] ?? '';
    
    if (empty($wallet)) {
        echo json_encode(['error' => 'Wallet address required']);
        exit;
    }
    
    $conn = getDb();
    $wallet = strtolower($conn->real_escape_string($wallet));
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE wallet_address = ?");
    $stmt->bind_param("s", $wallet);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // User exists, just return
        $user = $result->fetch_assoc();
    } else {
        // Create new user
        $newReferralCode = generateReferralCode();
        
        if (!empty($referralCode)) {
            // Check if referrer exists
            $referralCode = strtoupper($conn->real_escape_string($referralCode));
            $stmt = $conn->prepare("SELECT * FROM users WHERE referral_code = ?");
            $stmt->bind_param("s", $referralCode);
            $stmt->execute();
            $referrerResult = $stmt->get_result();
            
            if ($referrerResult->num_rows > 0) {
                $referrer = $referrerResult->fetch_assoc();
                
                // Insert new user with referrer
                $stmt = $conn->prepare("INSERT INTO users (wallet_address, referral_code, referred_by) VALUES (?, ?, ?)");
                $stmt->bind_param("sss", $wallet, $newReferralCode, $referralCode);
                $stmt->execute();
                
                // Update referrer stats
                $referrerWallet = $referrer['wallet_address'];
                $conn->query("INSERT INTO referral_stats (user_wallet, total_referrals) VALUES ('$referrerWallet', 1) 
                              ON DUPLICATE KEY UPDATE total_referrals = total_referrals + 1");
            } else {
                // No valid referrer, insert without referrer
                $stmt = $conn->prepare("INSERT INTO users (wallet_address, referral_code) VALUES (?, ?)");
                $stmt->bind_param("ss", $wallet, $newReferralCode);
                $stmt->execute();
            }
        } else {
            // No referral code, insert without referrer
            $stmt = $conn->prepare("INSERT INTO users (wallet_address, referral_code) VALUES (?, ?)");
            $stmt->bind_param("ss", $wallet, $newReferralCode);
            $stmt->execute();
        }
        
        // Get the new user
        $stmt = $conn->prepare("SELECT * FROM users WHERE wallet_address = ?");
        $stmt->bind_param("s", $wallet);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    }
    
    echo json_encode([
        'success' => true,
        'user' => [
            'wallet_address' => $user['wallet_address'],
            'referral_code' => $user['referral_code'],
            'referred_by' => $user['referred_by'],
        ],
    ]);
    
    $stmt->close();
    $conn->close();
}

-- Zam Wallet Referral System Database Setup
-- Run this in your cPanel PHPMyAdmin

-- Table 1: Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_address VARCHAR(100) UNIQUE NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by VARCHAR(20) DEFAULT NULL,
    referral_bonus_earned DECIMAL(20, 6) DEFAULT 0,
    referral_bonus_staked DECIMAL(20, 6) DEFAULT 0,
    referral_bonus_withdrawn DECIMAL(20, 6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_referral_code (referral_code),
    INDEX idx_wallet (wallet_address),
    INDEX idx_referred_by (referred_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 2: Referral Bonuses (tracks bonus tokens)
CREATE TABLE IF NOT EXISTS referral_bonuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_wallet VARCHAR(100) NOT NULL,
    referrer_wallet VARCHAR(100) NOT NULL,
    bonus_amount DECIMAL(20, 6) NOT NULL,
    bonus_type ENUM('new_user', 'referrer') DEFAULT 'new_user',
    status ENUM('pending', 'staked', 'released', 'burned') DEFAULT 'pending',
    tx_hash VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_wallet),
    INDEX idx_referrer (referrer_wallet),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 3: Referral Stats
CREATE TABLE IF NOT EXISTS referral_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_wallet VARCHAR(100) NOT NULL,
    total_referrals INT DEFAULT 0,
    total_bonus_earned DECIMAL(20, 6) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_wallet (user_wallet)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 4: Settings
CREATE TABLE IF NOT EXISTS referral_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default settings
INSERT INTO referral_settings (setting_key, setting_value) VALUES 
    ('new_user_bonus', '25'),
    ('referrer_bonus', '5'),
    ('min_stake_amount', '25'),
    ('bonus_lock_period', '14'),
    ('active', '1')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Sample user for testing (optional)
-- INSERT INTO users (wallet_address, referral_code) VALUES ('0xExample...', 'ZAM123ABC');

-- Zam Wallet Referral System Database Setup
-- Run this in PHPMyAdmin on your cPanel server

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_address VARCHAR(100) UNIQUE NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by VARCHAR(100) DEFAULT NULL,
    referral_bonus_earned DECIMAL(20, 8) DEFAULT 0,
    referral_bonus_staked DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wallet (wallet_address),
    INDEX idx_referral_code (referral_code)
);

-- Create referral stats table
CREATE TABLE IF NOT EXISTS referral_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_wallet VARCHAR(100) UNIQUE NOT NULL,
    total_referrals INT DEFAULT 0,
    total_bonus_earned DECIMAL(20, 8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_wallet) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create referral settings table
CREATE TABLE IF NOT EXISTS referral_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO referral_settings (setting_key, setting_value, description) VALUES
('new_user_bonus', '25', 'Bonus ZAMD for new users who sign up with a referral code'),
('referrer_bonus', '5', 'Bonus ZAMD for referrer when their referred friend signs up'),
('min_stake_amount', '25', 'Minimum amount of ZAMD that must be staked to earn referral bonus'),
('active', '1', 'Is the referral program active (1 = yes, 0 = no)'),
('max_referral_bonus', '500', 'Maximum total referral bonus a user can earn'),
('bonus_lock_period', '30', 'Days referral bonus is locked before it can be unstaked');

-- Test user (optional - for testing)
-- INSERT INTO users (wallet_address, referral_code, referred_by) VALUES 
-- ('0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00', 'ZAM123456', NULL);

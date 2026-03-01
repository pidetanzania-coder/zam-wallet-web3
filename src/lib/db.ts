import mysql from "mysql2/promise";

// Database connection pool
let pool: mysql.Pool | null = null;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "135.181.108.109",
      user: process.env.DB_USER || "zwallet_zamwallet",
      password: process.env.DB_PASSWORD || "bz3ZnXwx#1$jiQn$",
      database: process.env.DB_NAME || "zwallet_zamwallet",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// Generate unique referral code
export function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "ZAM";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check if wallet has referral code
export async function getUserByWallet(walletAddress: string) {
  const pool = getDbPool();
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE wallet_address = ?",
    [walletAddress.toLowerCase()]
  );
  const result = rows as any[];
  return result[0] || null;
}

// Get or create user with referral code
export async function getOrCreateUser(walletAddress: string, referredByCode?: string) {
  const pool = getDbPool();
  
  // Check if user exists
  const existingUser = await getUserByWallet(walletAddress);
  if (existingUser) {
    return existingUser;
  }
  
  // Create new user
  const referralCode = generateReferralCode();
  
  if (referredByCode) {
    // Check if referrer exists
    const [referrerRows]: any = await pool.query(
      "SELECT * FROM users WHERE referral_code = ?",
      [referredByCode.toUpperCase()]
    );
    
    if (referrerRows.length > 0) {
      // Insert new user with referrer
      await pool.query(
        `INSERT INTO users (wallet_address, referral_code, referred_by) VALUES (?, ?, ?)`,
        [walletAddress.toLowerCase(), referralCode, referredByCode.toUpperCase()]
      );
      
      // Update referrer's stats
      await pool.query(
        `UPDATE referral_stats SET total_referrals = total_referrals + 1 WHERE user_wallet = ?`,
        [referrerRows[0].wallet_address]
      );
      
      // Insert into stats if not exists
      await pool.query(
        `INSERT INTO referral_stats (user_wallet, total_referrals) VALUES (?, 1) 
         ON DUPLICATE KEY UPDATE total_referrals = total_referrals + 1`,
        [referrerRows[0].wallet_address]
      );
    }
  } else {
    // Insert without referrer
    await pool.query(
      `INSERT INTO users (wallet_address, referral_code) VALUES (?, ?)`,
      [walletAddress.toLowerCase(), referralCode]
    );
  }
  
  // Return the new user
  return getUserByWallet(walletAddress);
}

// Get user's referral stats
export async function getReferralStats(walletAddress: string) {
  const pool = getDbPool();
  const [rows]: any = await pool.query(
    `SELECT u.*, rs.total_referrals, rs.total_bonus_earned 
     FROM users u 
     LEFT JOIN referral_stats rs ON u.wallet_address = rs.user_wallet 
     WHERE u.wallet_address = ?`,
    [walletAddress.toLowerCase()]
  );
  return rows[0] || null;
}

// Record referral bonus (called when user stakes)
export async function recordReferralBonus(
  userWallet: string,
  referrerWallet: string,
  bonusAmount: number,
  bonusType: "new_user" | "referrer" = "new_user"
) {
  const pool = getDbPool();
  
  // Get settings
  const [settings]: any = await pool.query(
    "SELECT setting_value FROM referral_settings WHERE setting_key = ?",
    [bonusType === "new_user" ? "new_user_bonus" : "referrer_bonus"]
  );
  
  const amount = settings.length > 0 ? parseFloat(settings[0].setting_value) : bonusAmount;
  
  // Insert bonus record
  await pool.query(
    `INSERT INTO referral_bonuses (user_wallet, referrer_wallet, bonus_amount, bonus_type, status) 
     VALUES (?, ?, ?, ?, 'pending')`,
    [userWallet.toLowerCase(), referrerWallet.toLowerCase(), amount, bonusType]
  );
  
  // Update referrer stats
  await pool.query(
    `INSERT INTO referral_stats (user_wallet, total_bonus_earned) 
     VALUES (?, ?) 
     ON DUPLICATE KEY UPDATE total_bonus_earned = total_bonus_earned + ?`,
    [referrerWallet.toLowerCase(), amount, amount]
  );
  
  // Update user's bonus earned
  await pool.query(
    `UPDATE users SET referral_bonus_earned = referral_bonus_earned + ? 
     WHERE wallet_address = ?`,
    [amount, userWallet.toLowerCase()]
  );
  
  return amount;
}

// Mark bonus as staked
export async function markBonusStaked(userWallet: string, bonusType: "new_user" | "referrer") {
  const pool = getDbPool();
  
  // First get the bonus amount
  const [bonus]: any = await pool.query(
    `SELECT bonus_amount FROM referral_bonuses 
     WHERE user_wallet = ? AND bonus_type = ? AND status = 'pending'
     ORDER BY created_at ASC LIMIT 1`,
    [userWallet.toLowerCase(), bonusType]
  );
  
  // Mark as staked
  await pool.query(
    `UPDATE referral_bonuses 
     SET status = 'staked' 
     WHERE user_wallet = ? AND bonus_type = ? AND status = 'pending'
     ORDER BY created_at ASC LIMIT 1`,
    [userWallet.toLowerCase(), bonusType]
  );
  
  // Update user record
  if (bonus.length > 0) {
    await pool.query(
      `UPDATE users SET referral_bonus_staked = referral_bonus_staked + ? 
       WHERE wallet_address = ?`,
      [bonus[0].bonus_amount, userWallet.toLowerCase()]
    );
  }
}

// Get settings
export async function getReferralSettings() {
  const pool = getDbPool();
  const [rows]: any = await pool.query("SELECT * FROM referral_settings");
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.setting_key] = row.setting_value;
  }
  return settings;
}

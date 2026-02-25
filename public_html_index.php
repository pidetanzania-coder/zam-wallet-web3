<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zam Wallet - Your Gateway to DeFi</title>
    <link rel="icon" href="/favicon.ico">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            min-height: 100vh;
            color: white;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo img {
            width: 48px;
            height: 48px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(90deg, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        nav {
            display: flex;
            gap: 30px;
        }

        nav a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            font-size: 15px;
            transition: color 0.3s;
        }

        nav a:hover {
            color: white;
        }

        /* Hero */
        .hero {
            text-align: center;
            padding: 80px 0;
        }

        .hero h1 {
            font-size: 56px;
            line-height: 1.1;
            margin-bottom: 24px;
        }

        .hero h1 span {
            background: linear-gradient(90deg, #a855f7, #ec4899, #f472b6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            font-size: 20px;
            color: rgba(255,255,255,0.6);
            max-width: 600px;
            margin: 0 auto 40px;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(90deg, #a855f7, #ec4899);
            color: white;
            padding: 18px 48px;
            font-size: 18px;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .cta-button:hover {
            transform: scale(1.05);
            box-shadow: 0 20px 40px rgba(168, 85, 247, 0.4);
        }

        /* Features */
        .features {
            padding: 60px 0;
        }

        .features h2 {
            text-align: center;
            font-size: 40px;
            margin-bottom: 50px;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }

        .feature-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 30px;
            transition: transform 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 40px;
            margin-bottom: 16px;
        }

        .feature-card h3 {
            font-size: 20px;
            margin-bottom: 12px;
        }

        .feature-card p {
            color: rgba(255,255,255,0.6);
            font-size: 15px;
            line-height: 1.6;
        }

        /* Supported Chains */
        .chains {
            padding: 60px 0;
            text-align: center;
        }

        .chains h2 {
            font-size: 32px;
            margin-bottom: 30px;
        }

        .chain-logos {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .chain-logo {
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
        }

        /* Footer */
        footer {
            padding: 40px 0;
            border-top: 1px solid rgba(255,255,255,0.1);
            margin-top: 60px;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .footer-links a {
            color: rgba(255,255,255,0.5);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s;
        }

        .footer-links a:hover {
            color: white;
        }

        .copyright {
            text-align: center;
            color: rgba(255,255,255,0.3);
            margin-top: 20px;
            font-size: 14px;
        }

        /* Mobile */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 36px;
            }
            
            nav {
                display: none;
            }

            .hero {
                padding: 40px 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <img src="/zamd-logo.png" alt="Zam Wallet">
                <span class="logo-text">Zam Wallet</span>
            </div>
            <nav>
                <a href="#features">Features</a>
                <a href="#chains">Networks</a>
                <a href="https://zamwallet.xyz/terms">Terms</a>
                <a href="https://zamwallet.xyz/privacy">Privacy</a>
            </nav>
        </header>

        <section class="hero">
            <h1>The Future of <br><span>Decentralized Finance</span></h1>
            <p>Send, swap, and earn across 7 networks. Your keys, your crypto. Experience the next generation of Web3 wallets.</p>
            <a href="https://web.zamwallet.xyz/login" class="cta-button">Launch App →</a>
        </section>

        <section class="features" id="features">
            <h2>Why Choose Zam Wallet?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔄</div>
                    <h3>Instant Swaps</h3>
                    <p>Swap tokens across all 7 networks with the best rates. Cross-chain swaps made simple.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>Staking</h3>
                    <p>Earn up to 18% APY on your ZAMD tokens. Stake directly from your wallet.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💳</div>
                    <h3>Buy Crypto</h3>
                    <p>Instantly buy crypto using your credit/debit card. Get started in minutes.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔗</div>
                    <h3>Multi-Chain</h3>
                    <p>One wallet, 7 networks. Ethereum, Polygon, Arbitrum, Base, Optimism, BNB, Celo.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure</h3>
                    <p>Your device, your keys. Advanced encryption keeps your assets safe.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌙</div>
                    <h3>Dark Mode</h3>
                    <p>Choose your vibe. Beautiful themes that match your style.</p>
                </div>
            </div>
        </section>

        <section class="chains" id="chains">
            <h2>Supported Networks</h2>
            <div class="chain-logos">
                <div class="chain-logo">ETH</div>
                <div class="chain-logo">POL</div>
                <div class="chain-logo">ARB</div>
                <div class="chain-logo">BASE</div>
                <div class="chain-logo">OP</div>
                <div class="chain-logo">BNB</div>
                <div class="chain-logo">CELO</div>
            </div>
        </section>

        <footer>
            <div class="footer-links">
                <a href="https://zamwallet.xyz/terms">Terms of Service</a>
                <a href="https://zamwallet.xyz/privacy">Privacy Policy</a>
                <a href="https://zamwallet.xyz/risk">Risk Disclosures</a>
                <a href="https://zamwallet.xyz/help">Help & FAQ</a>
                <a href="https://zamwallet.xyz/kyc">KYC Policy</a>
                <a href="https://zamwallet.xyz/cookies">Cookie Policy</a>
            </div>
            <p class="copyright">© 2024 Zam Wallet. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>

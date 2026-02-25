<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zam Wallet - Your Gateway to DeFi</title>
    <link rel="icon" href="https://web.zamwallet.xyz/favicon.ico">
    <meta name="description" content="Send, swap, and earn across 7 networks. Your keys, your crypto.">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #8B5CF6;
            --secondary: #EC4899;
            --dark: #0F172A;
            --darker: #020617;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, var(--darker) 0%, #1e1b4b 50%, var(--dark) 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Animated Background */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
        }

        .bg-animation::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%);
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Floating Orbs */
        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
            width: 300px;
            height: 300px;
            background: rgba(139, 92, 246, 0.3);
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }

        .orb-2 {
            width: 250px;
            height: 250px;
            background: rgba(236, 72, 153, 0.25);
            top: 60%;
            right: 10%;
            animation-delay: 2s;
        }

        .orb-3 {
            width: 200px;
            height: 200px;
            background: rgba(59, 130, 246, 0.2);
            bottom: 20%;
            left: 30%;
            animation-delay: 4s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 1;
        }

        /* Header */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 0;
            backdrop-filter: blur(10px);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 100;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo img {
            width: 42px;
            height: 42px;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .logo-text {
            font-size: 24px;
            font-weight: 800;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.5px;
        }

        nav {
            display: flex;
            align-items: center;
            gap: 32px;
        }

        nav a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s;
            position: relative;
        }

        nav a::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transition: width 0.3s;
        }

        nav a:hover {
            color: white;
        }

        nav a:hover::after {
            width: 100%;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
;
            box-shadow: 0             color: white4px 20px rgba(139, 92, 246, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
        }

        .btn-outline {
            background: transparent;
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
        }

        .btn-outline:hover {
            border-color: var(--primary);
            background: rgba(139, 92, 246, 0.1);
        }

        /* Hero */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 120px 0 80px;
        }

        .hero-content {
            max-width: 800px;
        }

        .hero h1 {
            font-size: clamp(40px, 8vw, 72px);
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 24px;
            letter-spacing: -2px;
        }

        .hero h1 span {
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f472b6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .hero p {
            font-size: 20px;
            color: rgba(255,255,255,0.7);
            max-width: 600px;
            margin: 0 auto 40px;
            line-height: 1.6;
        }

        .hero-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .hero-stats {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin-top: 80px;
            flex-wrap: wrap;
        }

        .stat {
            text-align: center;
        }

        .stat-value {
            font-size: 36px;
            font-weight: 800;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .stat-label {
            font-size: 14px;
            color: rgba(255,255,255,0.5);
            margin-top: 4px;
        }

        /* Features */
        .features {
            padding: 100px 0;
        }

        .section-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-header h2 {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
            letter-spacing: -1px;
        }

        .section-header p {
            font-size: 18px;
            color: rgba(255,255,255,0.6);
            max-width: 500px;
            margin: 0 auto;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
        }

        .feature-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 32px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            border-color: rgba(139, 92, 246, 0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .feature-card:hover::before {
            opacity: 1;
        }

        .feature-icon {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            margin-bottom: 20px;
        }

        .feature-card h3 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
        }

        .feature-card p {
            color: rgba(255,255,255,0.6);
            font-size: 15px;
            line-height: 1.6;
        }

        /* Chains */
        .chains {
            padding: 80px 0;
            text-align: center;
        }

        .chains h2 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 40px;
        }

        .chain-logos {
            display: flex;
            justify-content: center;
            gap: 24px;
            flex-wrap: wrap;
        }

        .chain-logo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 12px;
            transition: all 0.3s;
        }

        .chain-logo:hover {
            transform: scale(1.1);
            background: rgba(139, 92, 246, 0.2);
            border-color: var(--primary);
        }

        .chain-logo img {
            width: 32px;
            height: 32px;
            margin-bottom: 4px;
        }

        /* CTA */
        .cta {
            padding: 100px 0;
            text-align: center;
        }

        .cta-box {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 32px;
            padding: 60px;
            max-width: 800px;
            margin: 0 auto;
        }

        .cta h2 {
            font-size: 40px;
            font-weight: 800;
            margin-bottom: 16px;
        }

        .cta p {
            font-size: 18px;
            color: rgba(255,255,255,0.7);
            margin-bottom: 32px;
        }

        /* Footer */
        footer {
            padding: 40px 0;
            border-top: 1px solid rgba(255,255,255,0.1);
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .footer-links {
            display: flex;
            gap: 24px;
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
            color: rgba(255,255,255,0.3);
            font-size: 14px;
        }

        /* Mobile */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 36px;
                letter-spacing: -1px;
            }
            
            nav {
                display: none;
            }

            .hero {
                padding: 100px 0 60px;
            }

            .hero-stats {
                gap: 30px;
            }

            .stat-value {
                font-size: 28px;
            }

            .section-header h2 {
                font-size: 32px;
            }

            .cta-box {
                padding: 40px 24px;
            }
        }
    </style>
</head>
<body>
    <div class="bg-animation">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    </div>

    <div class="container">
        <header>
            <div class="logo">
                <img src="https://web.zamwallet.xyz/zamd-logo.png" alt="Zam Wallet">
                <span class="logo-text">Zam Wallet</span>
            </div>
            <nav>
                <a href="#features">Features</a>
                <a href="#networks">Networks</a>
                <a href="https://zamwallet.xyz/terms">Terms</a>
                <a href="https://zamwallet.xyz/privacy">Privacy</a>
                <a href="https://web.zamwallet.xyz/login" class="btn btn-primary">Launch App</a>
            </nav>
        </header>

        <section class="hero">
            <div class="hero-content">
                <h1>The Future of <br><span>Decentralized Finance</span></h1>
                <p>Send, swap, and earn across 7 networks. Your keys, your crypto. Experience the next generation of Web3 wallets.</p>
                <div class="hero-buttons">
                    <a href="https://web.zamwallet.xyz/login" class="btn btn-primary">
                        Launch App
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                    <a href="#features" class="btn btn-outline">Learn More</a>
                </div>
                <div class="hero-stats">
                    <div class="stat">
                        <div class="stat-value">7+</div>
                        <div class="stat-label">Networks</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">18%</div>
                        <div class="stat-label">Staking APY</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">0.1%</div>
                        <div class="stat-label">Swap Fees</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="features" id="features">
            <div class="section-header">
                <h2>Why Choose Zam Wallet?</h2>
                <p>Everything you need to manage your crypto assets in one secure, easy-to-use wallet.</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🔄</div>
                    <h3>Instant Swaps</h3>
                    <p>Swap tokens across all 7 networks with the best rates. Cross-chain swaps made simple.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>High-Yield Staking</h3>
                    <p>Earn up to 18% APY on your ZAMD tokens. Stake directly from your wallet with flexible terms.</p>
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
                    <p>Your device, your keys. Advanced encryption keeps your assets safe. Non-custodial.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🌙</div>
                    <h3>Beautiful Design</h3>
                    <p>Choose your vibe. Beautiful themes that match your style. Dark mode by default.</p>
                </div>
            </div>
        </section>

        <section class="chains" id="networks">
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

        <section class="cta">
            <div class="cta-box">
                <h2>Ready to Get Started?</h2>
                <p>Launch Zam Wallet today and experience the future of DeFi.</p>
                <a href="https://web.zamwallet.xyz/login" class="btn btn-primary">Launch App Now →</a>
            </div>
        </section>

        <footer>
            <div class="footer-content">
                <div class="footer-links">
                    <a href="https://zamwallet.xyz/terms">Terms of Service</a>
                    <a href="https://zamwallet.xyz/privacy">Privacy Policy</a>
                    <a href="https://zamwallet.xyz/risk">Risk Disclosures</a>
                    <a href="https://zamwallet.xyz/help">Help & FAQ</a>
                    <a href="https://zamwallet.xyz/kyc">KYC Policy</a>
                    <a href="https://zamwallet.xyz/cookies">Cookie Policy</a>
                </div>
                <p class="copyright">© 2024 Zam Wallet. All rights reserved.</p>
            </div>
        </footer>
    </div>
</body>
</html>

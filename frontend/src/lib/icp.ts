/**
 * ICP Canister Client — mock + real adapter
 * 
 * In development (no dfx), this returns mock data.
 * When deployed to ICP, swap in the real canister actor.
 */

import type {
  QuizCategory,
  Question,
  QuizSession,
  SubmitAnswerResult,
  UserScore,
  Achievement,
  LeaderboardEntry,
  UserProfile,
} from '@/types';

// ── Mock Data ────────────────────────────────────────

const MOCK_CATEGORIES: QuizCategory[] = [
  { id: 'cat-1', name: 'Blockchain Basics', description: 'Learn the fundamentals of blockchain technology', icon: '🔗', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-2', name: 'ICP Fundamentals', description: 'Master the Internet Computer Protocol', icon: '🌐', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-3', name: 'DeFi & Tokenomics', description: 'Understand decentralized finance and tokens', icon: '💰', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-4', name: 'NFTs & Digital Art', description: 'Explore non-fungible tokens', icon: '🎨', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-5', name: 'Web3 Security', description: 'Stay safe in the decentralized web', icon: '🛡️', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-6', name: 'Smart Contracts', description: 'Dive into programmable contracts', icon: '📝', createdAt: 0n, updatedAt: 0n },
];

const MOCK_QUESTIONS: Record<string, Question[]> = {
  'cat-1': [
    { id: 'q-1', categoryId: 'cat-1', question: 'What is a blockchain?', options: ['A centralized database', 'A distributed ledger technology', 'A social media platform', 'A type of cryptocurrency'], correctAnswer: 'A distributed ledger technology', explanation: 'A blockchain is a decentralized, distributed ledger that records transactions across many computers.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-2', categoryId: 'cat-1', question: 'What is a consensus mechanism?', options: ['A way to reach agreement in a network', 'A type of smart contract', 'A wallet address', 'A mining pool'], correctAnswer: 'A way to reach agreement in a network', explanation: 'Consensus mechanisms are protocols that ensure all nodes in a network agree on the state of the blockchain.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-3', categoryId: 'cat-1', question: 'What makes blockchain secure?', options: ['Centralized control', 'Encryption and decentralization', 'Firewalls', 'Antivirus software'], correctAnswer: 'Encryption and decentralization', explanation: 'Blockchain security comes from cryptographic hashing, decentralization, and consensus mechanisms.', difficulty: 'beginner', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-10', categoryId: 'cat-1', question: 'What is a block in a blockchain?', options: ['A single transaction', 'A collection of transactions bundled together', 'A type of wallet', 'A mining algorithm'], correctAnswer: 'A collection of transactions bundled together', explanation: 'Each block contains a batch of transactions, a timestamp, and a hash of the previous block, forming a chain.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-11', categoryId: 'cat-1', question: 'What is hashing used for in blockchain?', options: ['Speeding up transactions', 'Creating unique fingerprints for data', 'Storing user passwords', 'Connecting to WiFi'], correctAnswer: 'Creating unique fingerprints for data', explanation: 'Hashing creates a fixed-size output from any input, making it ideal for verifying data integrity.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-12', categoryId: 'cat-1', question: 'What is decentralization?', options: ['Storing data on one server', 'Distributing control across many nodes', 'Using a single bank', 'Running on Windows'], correctAnswer: 'Distributing control across many nodes', explanation: 'Decentralization means no single entity controls the network — power is distributed among participants.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-13', categoryId: 'cat-1', question: 'What is a node in blockchain?', options: ['A smartphone app', 'A computer that participates in the network', 'A type of cryptocurrency', 'A security protocol'], correctAnswer: 'A computer that participates in the network', explanation: 'Nodes are computers that maintain a copy of the blockchain and help validate transactions.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-14', categoryId: 'cat-1', question: 'What is Proof of Work (PoW)?', options: ['A voting system', 'A consensus mechanism requiring computational effort', 'A type of smart contract', 'A wallet encryption method'], correctAnswer: 'A consensus mechanism requiring computational effort', explanation: 'PoW requires miners to solve complex puzzles to validate transactions and create new blocks.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-15', categoryId: 'cat-1', question: 'What is Proof of Stake (PoS)?', options: ['Mining with GPUs', 'A consensus mechanism based on held cryptocurrency', 'A type of NFT', 'A DeFi protocol'], correctAnswer: 'A consensus mechanism based on held cryptocurrency', explanation: 'PoS selects validators based on how much cryptocurrency they hold and are willing to stake as collateral.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-16', categoryId: 'cat-1', question: 'What is a private key?', options: ['A public wallet address', 'A secret code that controls your crypto assets', 'A type of blockchain', 'A mining tool'], correctAnswer: 'A secret code that controls your crypto assets', explanation: 'Your private key is like a password — it proves ownership and allows you to sign transactions. Never share it!', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-17', categoryId: 'cat-1', question: 'What is a public key?', options: ['A secret password', 'An address others can use to send you crypto', 'A mining algorithm', 'A type of smart contract'], correctAnswer: 'An address others can use to send you crypto', explanation: 'Your public key (or address) is safe to share — it lets others send you cryptocurrency.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-2': [
    { id: 'q-4', categoryId: 'cat-2', question: 'What is the Internet Computer (ICP)?', options: ['A cloud computing platform that extends the public internet', 'A private enterprise blockchain', 'A Layer 2 solution for Ethereum', 'A decentralized file storage system'], correctAnswer: 'A cloud computing platform that extends the public internet', explanation: 'ICP is a blockchain-based network that allows developers to deploy software directly to the internet, hosted by a decentralized network of nodes.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-5', categoryId: 'cat-2', question: 'What is a canister on ICP?', options: ['A Docker container', 'A WebAssembly module with persistent on-chain storage', 'A type of cryptocurrency wallet', 'A JavaScript runtime environment'], correctAnswer: 'A WebAssembly module with persistent on-chain storage', explanation: 'Canisters are smart contracts on ICP that bundle code (compiled to Wasm) and state. They can directly serve web content to browsers.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-20', categoryId: 'cat-2', question: 'What are Cycles on ICP?', options: ['A type of NFT', 'The computational gas token used to power canisters', 'A governance voting token', 'A stablecoin pegged to USD'], correctAnswer: 'The computational gas token used to power canisters', explanation: 'Cycles are burned to pay for canister computation and storage. Unlike Ethereum gas, cycle costs are predictable and stable.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-21', categoryId: 'cat-2', question: 'What is Internet Identity (II)?', options: ['A KYC verification service', 'A decentralized authentication framework using WebAuthn', 'A digital identity card on blockchain', 'A password manager for crypto'], correctAnswer: 'A decentralized authentication framework using WebAuthn', explanation: 'Internet Identity uses WebAuthn (biometrics, security keys) to authenticate users — no passwords, no seed phrases needed. Users are identified by anchor numbers.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-22', categoryId: 'cat-2', question: 'What makes ICP unique compared to other blockchains?', options: ['It has the fastest transaction speed', 'It can serve web content directly to browsers from smart contracts', 'It uses Proof of Work consensus', 'It only supports NFT minting'], correctAnswer: 'It can serve web content directly to browsers from smart contracts', explanation: 'ICP canisters can serve HTML, CSS, and JavaScript directly to browsers — meaning entire dApps live fully on-chain with no centralized frontend hosting.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-23', categoryId: 'cat-2', question: 'What is a subnet on ICP?', options: ['A smaller version of the main network', 'A blockchain that canister runs on, consisting of multiple nodes', 'A type of wallet address', 'A testing environment for developers'], correctAnswer: 'A blockchain that canister runs on, consisting of multiple nodes', explanation: 'Subnets are independent blockchains within ICP. Each subnet is run by a set of nodes and can host canisters. Different subnets can specialize (e.g., system subnets for NNS).', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-24', categoryId: 'cat-2', question: 'What languages can ICP canisters be written in?', options: ['Only Motoko', 'Rust, TypeScript (via Azle), Python (via Kybra), and Motoko', 'Solidity and Vyper only', 'JavaScript and Go'], correctAnswer: 'Rust, TypeScript (via Azle), Python (via Kybra), and Motoko', explanation: 'ICP supports multiple languages: Motoko (native), Rust (via CDK), TypeScript via Azle, and Python via Kybra. Azle compiles TypeScript to WebAssembly.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-25', categoryId: 'cat-2', question: 'What is the NNS (Network Nervous System)?', options: ['A firewall protecting ICP', 'ICP\'s decentralized governance system where neurons vote on proposals', 'A node monitoring dashboard', 'A token swap protocol'], correctAnswer: 'ICP\'s decentralized governance system where neurons vote on proposals', explanation: 'The NNS is ICP\'s on-chain governance. Users stake ICP in neurons and vote on proposals to upgrade the network, adjust parameters, or control treasury funds.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-26', categoryId: 'cat-2', question: 'What is a neuron in ICP governance?', options: ['A type of node', 'A staked ICP token that earns voting power and rewards', 'A canister with special privileges', 'A testnet account'], correctAnswer: 'A staked ICP token that earns voting power and rewards', explanation: 'Neurons are created by staking ICP tokens. The more ICP staked and the longer the dissolve delay, the more voting power the neuron has. Neurons earn rewards for participating in governance.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-27', categoryId: 'cat-2', question: 'What is the ICP token used for?', options: ['Only for trading on exchanges', 'Paying for computation (cycles conversion), staking for governance, and rewards', 'Only for creating NFTs', 'A stablecoin for payments'], correctAnswer: 'Paying for computation (cycles conversion), staking for governance, and rewards', explanation: 'ICP has three uses: (1) Convert to cycles for canister computation, (2) Stake in neurons for NNS governance voting, (3) Earn rewards as staking rewards or node provider rewards.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-28', categoryId: 'cat-2', question: 'What is chain-key cryptography on ICP?', options: ['A type of encryption for messages', 'A protocol that lets subnets sign transactions collectively without a single point of trust', 'A method for storing private keys', 'A consensus algorithm for mining'], correctAnswer: 'A protocol that lets subnets sign transactions collectively without a single point of trust', explanation: 'Chain-key cryptography allows ICP subnets to produce signatures that verifiers can check without tracking the full chain. This enables ICP to interact with other blockchains.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-29', categoryId: 'cat-2', question: 'What is ckBTC?', options: ['A wrapped Bitcoin on Ethereum', 'A chain-key token on ICP that is 1:1 backed by real Bitcoin', 'A Bitcoin mining pool on ICP', 'A Bitcoin wallet for ICP'], correctAnswer: 'A chain-key token on ICP that is 1:1 backed by real Bitcoin', explanation: 'ckBTC (chain-key Bitcoin) is a twin of Bitcoin on ICP. It is backed 1:1 by real BTC held in a canister, allowing Bitcoin transactions on ICP with low fees and fast finality.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-30', categoryId: 'cat-2', question: 'What is a SNS (Service Nervous System)?', options: ['A monitoring tool for canisters', 'A framework to decentralize a dApp\'s governance and token economics', 'A subnet management dashboard', 'A type of smart contract language'], correctAnswer: 'A framework to decentralize a dApp\'s governance and token economics', explanation: 'SNS lets developers hand over control of their dApp to a DAO. It creates a governance token, a treasury, and community-driven decision-making, similar to NNS but per-project.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-3': [
    { id: 'q-31', categoryId: 'cat-3', question: 'What does DeFi stand for?', options: ['Digital Finance', 'Decentralized Finance', 'Direct Funding', 'Distributed Filecoin'], correctAnswer: 'Decentralized Finance', explanation: 'DeFi refers to financial services — lending, trading, borrowing — built on blockchain technology without traditional banks or intermediaries.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-32', categoryId: 'cat-3', question: 'What is a DEX (Decentralized Exchange)?', options: ['A crypto ATM', 'A protocol that lets users trade tokens directly via smart contracts without a central operator', 'A centralized trading platform', 'A type of wallet'], correctAnswer: 'A protocol that lets users trade tokens directly via smart contracts without a central operator', explanation: 'DEXs like ICPSwap (on ICP) or Uniswap (on Ethereum) use Automated Market Makers to enable peer-to-peer token swaps without intermediaries.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-33', categoryId: 'cat-3', question: 'What is an AMM (Automated Market Maker)?', options: ['A human market maker', 'An algorithm that uses a mathematical formula to price tokens in liquidity pools', 'A type of wallet', 'A mining tool'], correctAnswer: 'An algorithm that uses a mathematical formula to price tokens in liquidity pools', explanation: 'AMMs replace order books with formulas (like x*y=k on Uniswap). Prices adjust automatically based on supply and demand in the pool.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-34', categoryId: 'cat-3', question: 'What is a liquidity pool?', options: ['A swimming pool with crypto', 'A smart contract that holds pairs of tokens for decentralized trading', 'A bank vault on blockchain', 'A type of NFT'], correctAnswer: 'A smart contract that holds pairs of tokens for decentralized trading', explanation: 'Liquidity pools lock two tokens (e.g., ICP/ckUSDC). Traders swap against the pool, and liquidity providers earn fees from each trade.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-35', categoryId: 'cat-3', question: 'What is yield farming?', options: ['Agriculture on blockchain', 'Strategically moving crypto across protocols to maximize returns from providing liquidity', 'Mining Bitcoin with GPUs', 'Buying NFTs at low prices'], correctAnswer: 'Strategically moving crypto across protocols to maximize returns from providing liquidity', explanation: 'Yield farmers provide liquidity to various DeFi protocols and move funds between them to earn the highest possible interest, fees, or token rewards.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-36', categoryId: 'cat-3', question: 'What is a stablecoin?', options: ['A very volatile cryptocurrency', 'A token designed to maintain a stable value, usually pegged to USD', 'A type of NFT', 'A governance token'], correctAnswer: 'A token designed to maintain a stable value, usually pegged to USD', explanation: 'Stablecoins like ckUSDC (on ICP) or USDC maintain ~$1 price. They enable DeFi transactions without volatility risk.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-37', categoryId: 'cat-3', question: 'What is Total Value Locked (TVL) in DeFi?', options: ['How many users are locked out', 'The total value of assets deposited in DeFi protocols', 'The cost of a smart contract', 'A wallet balance'], correctAnswer: 'The total value of assets deposited in DeFi protocols', explanation: 'TVL is a key metric — it shows how much money is staked, locked, or deposited across a protocol. Higher TVL generally means more trust and usage.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-38', categoryId: 'cat-3', question: 'What is impermanent loss?', options: ['Losing your seed phrase', 'The loss in value a liquidity provider experiences when token prices diverge from when they deposited', 'A permanent blockchain error', 'A type of rug pull'], correctAnswer: 'The loss in value a liquidity provider experiences when token prices diverge from when they deposited', explanation: 'If one token in a pool appreciates significantly, the LP ends up with less value than if they had simply held both tokens in their wallet.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-39', categoryId: 'cat-3', question: 'What is lending/borrowing in DeFi?', options: ['Getting a bank loan', 'Using smart contracts to lend crypto for interest or borrow against collateral', 'Sending crypto to a friend', 'Buying tokens on an exchange'], correctAnswer: 'Using smart contracts to lend crypto for interest or borrow against collateral', explanation: 'DeFi lending protocols (like Aave, or Elluminex on ICP) let users supply tokens to earn interest, or borrow by depositing collateral — all automated by smart contracts.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-40', categoryId: 'cat-3', question: 'What is staking?', options: ['Gambling crypto', 'Locking tokens to support network operations and earn rewards', 'Selling tokens at a loss', 'Creating a new wallet'], correctAnswer: 'Locking tokens to support network operations and earn rewards', explanation: 'Staking means locking tokens in a protocol — either to secure the network (like ICP neuron staking) or to provide liquidity (like LP staking). Stakers earn yield.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-41', categoryId: 'cat-3', question: 'What is a flash loan?', options: ['A quick bank transfer', 'An uncollateralized loan that must be borrowed and repaid within one blockchain transaction', 'A loan with fast approval', 'A micro-loan for NFTs'], correctAnswer: 'An uncollateralized loan that must be borrowed and repaid within one blockchain transaction', explanation: 'Flash loans let you borrow millions with no collateral — but only if you repay it (plus fees) in the same transaction. Attackers use them for price manipulation.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-42', categoryId: 'cat-3', question: 'What DeFi apps exist on ICP?', options: ['Only on Ethereum', 'ICPSwap, Sonic, DSCVR, and OpenChat all use DeFi features', 'No DeFi on ICP yet', 'Only Bitcoin on ICP'], correctAnswer: 'ICPSwap, Sonic, DSCVR, and OpenChat all use DeFi features', explanation: 'ICP has a growing DeFi ecosystem: ICPSwap (DEX), Sonic (DEX), and social platforms like DSCVR and OpenChat integrate token rewards and DeFi mechanics.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-4': [
    { id: 'q-7', categoryId: 'cat-4', question: 'What is an NFT?', options: ['A type of cryptocurrency', 'A non-fungible token representing unique ownership', 'A network protocol', 'A database system'], correctAnswer: 'A non-fungible token representing unique ownership', explanation: 'NFTs are unique digital tokens that represent ownership of specific items or content on the blockchain.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-40', categoryId: 'cat-4', question: 'What does "non-fungible" mean?', options: ['Very expensive', 'Unique and not interchangeable', 'Faster than other tokens', 'Open source'], correctAnswer: 'Unique and not interchangeable', explanation: 'Non-fungible means each token is unique — like a one-of-a-kind painting vs a dollar bill.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-41', categoryId: 'cat-4', question: 'What is minting an NFT?', options: ['Selling an NFT', 'Creating a new NFT on the blockchain', 'Buying an NFT', 'Deleting an NFT'], correctAnswer: 'Creating a new NFT on the blockchain', explanation: 'Minting is the process of registering a new NFT on-chain, linking it to digital content.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-42', categoryId: 'cat-4', question: 'What is NFT metadata?', options: ['The NFT price', 'Information describing the NFT (name, attributes, image)', 'The blockchain network', 'A wallet address'], correctAnswer: 'Information describing the NFT (name, attributes, image)', explanation: 'Metadata stores the NFT\'s name, image URL, and traits — what makes it unique.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-43', categoryId: 'cat-4', question: 'What is an NFT marketplace?', options: ['A physical store', 'A platform to buy, sell, and trade NFTs', 'A type of wallet', 'A blockchain'], correctAnswer: 'A platform to buy, sell, and trade NFTs', explanation: 'Marketplaces like OpenSea and Magic Eden let users browse, buy, and sell NFTs.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-44', categoryId: 'cat-4', question: 'What role do smart contracts play in NFTs?', options: ['They store images', 'They define ownership, transfers, and royalties', 'They mine NFTs', 'They are NFT wallets'], correctAnswer: 'They define ownership, transfers, and royalties', explanation: 'NFT smart contracts define who owns what, how tokens transfer, and royalty percentages.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-45', categoryId: 'cat-4', question: 'What are NFT royalties?', options: ['Tax on NFT sales', 'Percentage of secondary sales paid to the original creator', 'Gas fees', 'Storage costs'], correctAnswer: 'Percentage of secondary sales paid to the original creator', explanation: 'Royalties ensure creators earn money every time their NFT is resold — typically 5-10%.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-46', categoryId: 'cat-4', question: 'What is an NFT collection?', options: ['A single expensive NFT', 'A set of NFTs with a shared theme or creator', 'A type of blockchain', 'A wallet'], correctAnswer: 'A set of NFTs with a shared theme or creator', explanation: 'Collections group related NFTs — like Bored Apes or Art Blocks — often with 1,000+ unique pieces.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-47', categoryId: 'cat-4', question: 'What is IPFS in the context of NFTs?', options: ['A payment system', 'A decentralized storage network for NFT files', 'A blockchain', 'A wallet'], correctAnswer: 'A decentralized storage network for NFT files', explanation: 'IPFS stores NFT images and metadata off-chain in a decentralized way, ensuring permanence.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-5': [
    { id: 'q-50', categoryId: 'cat-5', question: 'What is a phishing attack in Web3?', options: ['Fishing for crypto rewards', 'Tricking users into signing malicious transactions or revealing private keys via fake sites/msgs', 'A type of mining attack', 'A DDoS on a blockchain'], correctAnswer: 'Tricking users into signing malicious transactions or revealing private keys via fake sites/msgs', explanation: 'Web3 phishing uses fake dApp sites, Discord DMs, or Twitter posts to trick you into connecting your wallet and signing transactions that drain your funds.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-51', categoryId: 'cat-5', question: 'What is a rug pull?', options: ['An NFT art style', 'When project founders abruptly abandon and drain liquidity or mint unlimited tokens', 'A mining technique', 'A consensus mechanism'], correctAnswer: 'When project founders abruptly abandon and drain liquidity or mint unlimited tokens', explanation: 'Rug pulls are exit scams — founders hype a project, collect funds, then disappear with the money. Red flags: anonymous team, no audit, locked liquidity not verified.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-52', categoryId: 'cat-5', question: 'What is a smart contract audit?', options: ['A tax review by the IRS', 'A systematic security review of smart contract code by professional auditors', 'A blockchain upgrade', 'A wallet security check'], correctAnswer: 'A systematic security review of smart contract code by professional auditors', explanation: 'Audits (by firms like Trail of Bits, Certik, or Dfinity Developer Grant Program) find vulnerabilities before deployment. Critical for any project handling real funds.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-53', categoryId: 'cat-5', question: 'What is a honeypot token?', options: ['A sweet DeFi reward', 'A scam contract that lets you buy a token but blocks you from selling it', 'A type of wallet', 'A mining pool'], correctAnswer: 'A scam contract that lets you buy a token but blocks you from selling it', explanation: 'Honeypot contracts use hidden logic (like blacklisting or transfer restrictions) so only the scammer can sell. Always test with small amounts and check contract code.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-54', categoryId: 'cat-5', question: 'What should you NEVER share or expose?', options: ['Your wallet address', 'Your private key or seed phrase', 'Your NFT collection', 'Your GitHub username'], correctAnswer: 'Your private key or seed phrase', explanation: 'Your private key or 12/24-word seed phrase gives FULL control of ALL your assets across ALL networks. Never share it with anyone — no legitimate service will ever ask for it.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-55', categoryId: 'cat-5', question: 'What is a hardware wallet and why use one?', options: ['A mining rig', 'A physical device that stores private keys offline, immune to online hacks', 'A type of blockchain node', 'A cold storage paper wallet'], correctAnswer: 'A physical device that stores private keys offline, immune to online hacks', explanation: 'Hardware wallets (Ledger, Trezor) keep your keys on an air-gapped device. Even if your computer is compromised, transactions must be physically confirmed on the device.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-56', categoryId: 'cat-5', question: 'What is approval phishing?', options: ['Asking for fishing tips', 'Tricking users into signing unlimited token approvals so the attacker can drain tokens later', 'A type of wallet', 'A consensus attack'], correctAnswer: 'Tricking users into signing unlimited token approvals so the attacker can drain tokens later', explanation: 'Attackers disguise malicious contracts as legitimate dApps. When you sign an approval, they get unlimited spending rights. Always check approval amounts and revoke unused approvals.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-57', categoryId: 'cat-5', question: 'What is front-running?', options: ['Running ahead of a marathon', 'Exploiting pending transactions by placing yours first using mempool data', 'A type of mining', 'A wallet feature'], correctAnswer: 'Exploiting pending transactions by placing yours first using mempool data', explanation: 'MEV bots monitor pending transactions and insert their own first (or sandwich attacks) to profit from the price movement. Common on Ethereum; ICP has different architecture that reduces this.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-58', categoryId: 'cat-5', question: 'What is a reentrancy attack?', options: ['Logging in twice', 'A vulnerability where an external call re-enters a function before the first call completes', 'A type of DDoS', 'A wallet exploit'], correctAnswer: 'A vulnerability where an external call re-enters a function before the first call completes', explanation: 'Reentrancy allows attackers to recursively call a withdrawal function before balances update, draining funds. The 2016 DAO hack used this. Fixed by checks-effects-interactions pattern.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-59', categoryId: 'cat-5', question: 'What is a flash loan attack?', options: ['A fast bank transfer', 'Borrowing and repaying millions in one transaction to manipulate prices and exploit protocols', 'A type of mining reward', 'A wallet backup'], correctAnswer: 'Borrowing and repaying millions in one transaction to manipulate prices and exploit protocols', explanation: 'Flash loans let you borrow huge amounts with no collateral if repaid in the same block. Attackers use them to manipulate oracle prices or exploit vulnerable DeFi protocols.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-60', categoryId: 'cat-5', question: 'What is the best way to verify a dApp before connecting your wallet?', options: ['Trust Twitter ads', 'Check the URL, verify contract addresses, look for audits, and use tools like ICSCan', 'Connect immediately', 'Only use MetaMask'], correctAnswer: 'Check the URL, verify contract addresses, look for audits, and use tools like ICSCan', explanation: 'Always verify: correct URL (check for typosquatting), contract address matches official docs, recent audit reports, community reputation, and use block explorers to verify code.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
  ],
  'cat-6': [
    { id: 'q-60', categoryId: 'cat-6', question: 'What is a smart contract?', options: ['A legal agreement', 'Self-executing code on a blockchain', 'A type of wallet', 'A cryptocurrency'], correctAnswer: 'Self-executing code on a blockchain', explanation: 'Smart contracts are programs that automatically execute when conditions are met — no intermediaries needed.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-61', categoryId: 'cat-6', question: 'What language is used for Ethereum smart contracts?', options: ['Python', 'Solidity', 'JavaScript', 'Rust'], correctAnswer: 'Solidity', explanation: 'Solidity is the primary language for writing smart contracts on Ethereum and EVM-compatible chains.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-62', categoryId: 'cat-6', question: 'What is gas in smart contracts?', options: ['Fuel for computers', 'The fee paid to execute operations on blockchain', 'A type of token', 'A mining reward'], correctAnswer: 'The fee paid to execute operations on blockchain', explanation: 'Gas compensates validators for the computational work of executing your smart contract code.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-63', categoryId: 'cat-6', question: 'What is immutability in smart contracts?', options: ['They can be changed anytime', 'Once deployed, the code cannot be altered', 'They run forever', 'They use encryption'], correctAnswer: 'Once deployed, the code cannot be altered', explanation: 'Immutability means deployed contracts cannot be modified — this is both a feature and a risk.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-64', categoryId: 'cat-6', question: 'What is a dApp?', options: ['A mobile app', 'A decentralized application running on blockchain', 'A database', 'A website'], correctAnswer: 'A decentralized application running on blockchain', explanation: 'dApps combine smart contracts (backend) with a frontend to create fully decentralized applications.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-65', categoryId: 'cat-6', question: 'What is an ERC-20 token?', options: ['A type of NFT', 'A standard for fungible tokens on Ethereum', 'A wallet type', 'A mining algorithm'], correctAnswer: 'A standard for fungible tokens on Ethereum', explanation: 'ERC-20 defines rules for creating tokens — USDC, DAI, and UNI all follow this standard.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-66', categoryId: 'cat-6', question: 'What is an upgradeable smart contract?', options: ['A contract that speeds up', 'A contract designed to be updated after deployment', 'A free contract', 'A mobile app'], correctAnswer: 'A contract designed to be updated after deployment', explanation: 'Using proxy patterns, upgradeable contracts can be improved while preserving state and address.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-67', categoryId: 'cat-6', question: 'What is reentrancy in smart contracts?', options: ['Running twice', 'A vulnerability where a function is called before finishing', 'A type of token', 'A wallet feature'], correctAnswer: 'A vulnerability where a function is called before finishing', explanation: 'Reentrancy attacks exploit callbacks to drain funds — the DAO hack used this exact vulnerability.', difficulty: 'advanced', points: 20n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-68', categoryId: 'cat-6', question: 'What is OpenZeppelin?', options: ['A pirate coin', 'A library of secure, audited smart contract templates', 'A blockchain', 'A wallet'], correctAnswer: 'A library of secure, audited smart contract templates', explanation: 'OpenZeppelin provides battle-tested contracts for tokens, access control, and more.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-69', categoryId: 'cat-6', question: 'What is a testnet?', options: ['A fast mainnet', 'A testing environment that mimics the main blockchain', 'A type of wallet', 'A mining pool'], correctAnswer: 'A testing environment that mimics the main blockchain', explanation: 'Testnets let developers experiment with fake tokens before deploying to mainnet with real value.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
  ],
};

// ── Mock Store (in-memory for dev) ───────────────────

let mockSessions: QuizSession[] = [];
let mockScores: Record<string, UserScore> = {};
let mockAchievements: Achievement[] = [];
let mockUsers: UserProfile[] = [];

// ── Helpers ───────────────────────────────────────────

function getTier(xp: number): UserScore['tier'] {
  if (xp >= 100000) return 'diamond';
  if (xp >= 50000) return 'platinum';
  if (xp >= 10000) return 'gold';
  if (xp >= 1000) return 'silver';
  return 'bronze';
}

function checkAndAwardAchievements(userId: string, score: UserScore) {
  const existing = mockAchievements.filter((a) => a.userId === userId);
  const existingNames = new Set(existing.map((a) => a.name));
  const now = BigInt(Date.now());

  const defs: { name: string; desc: string; icon: string; check: () => boolean }[] = [
    { name: 'First Quiz', desc: 'Complete your first quiz', icon: '🎯', check: () => score.quizzesCompleted >= 1n },
    { name: 'Quick Learner', desc: 'Complete 10 quizzes', icon: '📚', check: () => score.quizzesCompleted >= 10n },
    { name: 'Quiz Master', desc: 'Complete 50 quizzes', icon: '🏆', check: () => score.quizzesCompleted >= 50n },
    { name: 'Perfect Score', desc: 'Get 100% on any quiz', icon: '💯', check: () => score.correctAnswers === score.totalAnswers && score.totalAnswers > 0n },
    { name: 'Bronze Tier', desc: 'Reach Bronze tier', icon: '🥉', check: () => score.tier === 'bronze' },
    { name: 'Silver Tier', desc: 'Reach Silver tier', icon: '🥈', check: () => score.tier === 'silver' },
    { name: 'Gold Tier', desc: 'Reach Gold tier', icon: '🥇', check: () => score.tier === 'gold' },
    { name: 'Platinum Tier', desc: 'Reach Platinum tier', icon: '💎', check: () => score.tier === 'platinum' },
    { name: 'Diamond Tier', desc: 'Reach Diamond tier', icon: '👑', check: () => score.tier === 'diamond' },
    { name: 'On Fire', desc: '7-day quiz streak', icon: '🔥', check: () => score.streak >= 7n },
    { name: 'Unstoppable', desc: '30-day quiz streak', icon: '⚡', check: () => score.streak >= 30n },
    { name: 'Century', desc: 'Earn 100 XP', icon: '💪', check: () => score.totalXP >= 100n },
    { name: 'Thousand', desc: 'Earn 1,000 XP', icon: '🌟', check: () => score.totalXP >= 1000n },
  ];

  for (const def of defs) {
    if (!existingNames.has(def.name) && def.check()) {
      mockAchievements.push({
        id: `ach-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId,
        name: def.name,
        description: def.desc,
        icon: def.icon,
        unlockedAt: now,
      });
    }
  }
}

// ── API Client ───────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  // ─── Categories ───
  async getCategories(): Promise<QuizCategory[]> {
    await delay(300);
    return MOCK_CATEGORIES;
  },

  async getCategory(id: string): Promise<QuizCategory | null> {
    await delay(200);
    return MOCK_CATEGORIES.find((c) => c.id === id) ?? null;
  },

  // ─── Questions ───
  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    await delay(400);
    return MOCK_QUESTIONS[categoryId] ?? [];
  },

  async getQuestion(id: string): Promise<Question | null> {
    await delay(200);
    for (const qs of Object.values(MOCK_QUESTIONS)) {
      const q = qs.find((q) => q.id === id);
      if (q) return q;
    }
    return null;
  },

  // ─── Quiz Sessions ───
  async startQuiz(userId: string, categoryId: string): Promise<QuizSession> {
    await delay(500);
    const questions = await api.getQuestionsByCategory(categoryId);
    const session: QuizSession = {
      id: `session-${Date.now()}`,
      userId,
      categoryId,
      score: 0n,
      totalQuestions: BigInt(questions.length),
      correctAnswers: 0n,
      completed: false,
      startedAt: BigInt(Date.now()),
      completedAt: [],
    };
    mockSessions.push(session);
    return session;
  },

  async submitAnswer(
    sessionId: string,
    questionId: string,
    selectedAnswer: string
  ): Promise<SubmitAnswerResult> {
    await delay(300);
    const question = await api.getQuestion(questionId);
    if (!question) throw new Error('Question not found');

    const correct = selectedAnswer === question.correctAnswer;
    const session = mockSessions.find((s) => s.id === sessionId);
    const pointsEarned = correct ? Number(question.points) : 0;

    if (session) {
      session.score = BigInt(Number(session.score) + pointsEarned);
      session.correctAnswers = BigInt(
        Number(session.correctAnswers) + (correct ? 1 : 0)
      );
    }

    return {
      correct,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsEarned: BigInt(pointsEarned),
      totalScore: session?.score ?? 0n,
    };
  },

  async completeQuiz(sessionId: string): Promise<QuizSession> {
    await delay(300);
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    session.completed = true;
    session.completedAt = [BigInt(Date.now())];
    return session;
  },

  async getSession(id: string): Promise<QuizSession | null> {
    await delay(200);
    return mockSessions.find((s) => s.id === id) ?? null;
  },

  async getUserSessions(userId: string): Promise<QuizSession[]> {
    await delay(200);
    return mockSessions.filter((s) => s.userId === userId);
  },

  // ─── Scoring ───
  async updateScore(
    userId: string,
    xpEarned: number,
    correct: boolean,
    totalQuestions: number
  ): Promise<UserScore> {
    await delay(300);
    const existing = mockScores[userId];
    const now = BigInt(Date.now());

    const score: UserScore = existing
      ? {
          ...existing,
          totalXP: existing.totalXP + BigInt(xpEarned),
          quizzesCompleted: existing.quizzesCompleted + 1n,
          correctAnswers: existing.correctAnswers + (correct ? 1n : 0n),
          totalAnswers: existing.totalAnswers + BigInt(totalQuestions),
          streak: existing.lastQuizDate + 86400000000000n >= now
            ? existing.streak + 1n
            : 1n,
          lastQuizDate: now,
          tier: getTier(Number(existing.totalXP) + xpEarned),
          rank: 0n,
          updatedAt: now,
        }
      : {
          userId,
          totalXP: BigInt(xpEarned),
          quizzesCompleted: 1n,
          correctAnswers: correct ? 1n : 0n,
          totalAnswers: BigInt(totalQuestions),
          streak: 1n,
          lastQuizDate: now,
          tier: getTier(xpEarned),
          rank: 0n,
          updatedAt: now,
        };

    mockScores[userId] = score;

    // Award achievements
    checkAndAwardAchievements(userId, score);

    return score;
  },

  async getScore(userId: string): Promise<UserScore | null> {
    await delay(200);
    return mockScores[userId] ?? null;
  },

  async getLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    await delay(300);
    return Object.values(mockScores)
      .sort((a, b) => Number(b.totalXP - a.totalXP))
      .slice(offset, offset + limit)
      .map((s, i) => ({
        userId: s.userId,
        totalXP: s.totalXP,
        quizzesCompleted: s.quizzesCompleted,
        tier: s.tier,
        rank: BigInt(offset + i + 1),
      }));
  },

  // ─── Achievements ───
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    await delay(200);
    return mockAchievements.filter((a) => a.userId === userId);
  },

  // ─── Users ───
  async createUser(
    username: string,
    displayName: string,
    principalId: string,
    authProvider: string,
    avatar: string
  ): Promise<UserProfile> {
    await delay(400);
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      username,
      displayName,
      email: [],
      avatar,
      bio: [],
      principalId,
      authProvider: authProvider as 'internet_identity' | 'google',
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      isActive: true,
    };
    mockUsers.push(user);
    return user;
  },

  async getUserByPrincipal(principalId: string): Promise<UserProfile | null> {
    await delay(200);
    return mockUsers.find((u) => u.principalId === principalId) ?? null;
  },
};

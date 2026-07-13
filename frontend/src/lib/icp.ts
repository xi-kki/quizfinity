/**
 * ICP Canister Client — mock + real adapter
 * 
 * In development (no dfx), this returns mock data.
 * When deployed to ICP with canister IDs, uses real actors.
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
import { isProduction } from './canister.config';
import { getQuizEngineActor, getScoringActor, getUserActor } from './actor';

// ── Canister Actors (lazy init) ────────────────────────

let quizEngine: any = null;
let scoring: any = null;
let userActor: any = null;

function getActors() {
  if (isProduction && !quizEngine) {
    quizEngine = getQuizEngineActor();
    scoring = getScoringActor();
    userActor = getUserActor();
  }
  return { quizEngine, scoring, userActor };
}

// ── Mock Data ────────────────────────────────────────

const MOCK_CATEGORIES: QuizCategory[] = [
  { id: 'cat-1', name: 'Blockchain Basics', description: 'Learn the fundamentals of blockchain technology', icon: 'link', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-2', name: 'ICP Fundamentals', description: 'Master the Internet Computer Protocol', icon: 'globe', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-3', name: 'DeFi & Tokenomics', description: 'Understand decentralized finance and tokens', icon: 'coins', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-4', name: 'NFTs & Digital Art', description: 'Explore non-fungible tokens', icon: 'palette', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-5', name: 'Web3 Security', description: 'Stay safe in the decentralized web', icon: 'shield', createdAt: 0n, updatedAt: 0n },
  { id: 'cat-6', name: 'Smart Contracts', description: 'Dive into programmable contracts', icon: 'file-code', createdAt: 0n, updatedAt: 0n },
];

// ── Lesson Content (short teach-before-quiz) ──────────

const LESSONS: Record<string, string> = {
  // ─── Blockchain Basics ───
  'q-1': 'A blockchain is like a shared spreadsheet that thousands of computers maintain together. Instead of one bank holding the records, everyone has a copy — and new entries require network agreement. This makes it nearly impossible to cheat or tamper with data.',
  'q-2': 'When thousands of computers need to agree on what\'s true, they use a consensus mechanism. Think of it as a voting system where nodes validate transactions. The two most common are Proof of Work (solve puzzles) and Proof of Stake (hold tokens).',
  'q-3': 'Blockchain security comes from three pillars: cryptographic hashing (math-based fingerprints), decentralization (no single point of failure), and consensus (network agreement). No firewall or antivirus needed — the math does the protection.',
  'q-10': 'A block is like a page in a ledger. It bundles multiple transactions together, adds a timestamp, and includes a hash (fingerprint) of the previous block. This creates a chain — hence "blockchain." Alter one block, and every following block breaks.',
  'q-11': 'Hashing takes any input (a file, a transaction, your password) and produces a fixed-length string. Change one character in the input, and the hash completely changes. Blockchains use this to verify data hasn\'t been tampered with.',
  'q-12': 'In traditional systems, one company controls the servers. Decentralization spreads that control across hundreds or thousands of independent nodes. No single entity can shut it down, censor transactions, or change the rules unilaterally.',
  'q-13': 'A node is simply a computer running blockchain software. It stores a copy of the blockchain, validates transactions, and helps propagate new blocks. Anyone can run a node — that\'s what makes the network permissionless.',
  'q-14': 'Proof of Work was Bitcoin\'s breakthrough. Miners compete to solve complex mathematical puzzles. The winner gets to add the next block and earn a reward. It\'s secure but energy-intensive — that\'s why Ethereum moved to Proof of Stake.',
  'q-15': 'Instead of burning electricity, Proof of Stake selects validators based on how many tokens they\'re willing to lock up as collateral. More stake = higher chance of being chosen. If you cheat, you lose your stake. Energy-efficient and increasingly popular.',
  'q-16': 'Your private key is a secret number that proves you own your crypto. It\'s used to sign transactions — like a digital signature. If someone gets your private key, they control your funds. Never share it, never store it online.',
  'q-17': 'Your public key is derived from your private key and generates your wallet address. Share it freely — people use it to send you crypto. It\'s like your email address: safe to public, but can\'t access your inbox.',

  // ─── ICP Fundamentals ───
  'q-4': 'The Internet Computer (ICP) is a blockchain that extends the internet itself. Unlike other chains that only store data, ICP can host entire applications — frontend, backend, and storage — all running on a decentralized network of nodes.',
  'q-5': 'A canister is ICP\'s version of a smart contract — but more powerful. It bundles code (compiled to WebAssembly) with persistent storage and can directly serve web content to browsers. Think of it as a server that lives on-chain.',
  'q-20': 'Cycles are ICP\'s computational gas. When you deploy a canister, cycles are burned to pay for CPU, memory, and bandwidth. Unlike Ethereum\'s volatile gas fees, cycle costs on ICP are predictable and stable.',
  'q-21': 'Internet Identity replaces passwords with WebAuthn — your fingerprint, Face ID, or security key. No seed phrases to memorize. You get an anchor number, and authentication happens through your device\'s built-in biometrics.',
  'q-22': 'Most blockchains can only store data. ICP canisters can serve HTML, CSS, and JavaScript directly to browsers — meaning entire dApps live fully on-chain with zero centralized hosting. No AWS, no Vercel needed.',
  'q-23': 'Subnets are independent blockchains within ICP, each run by a set of nodes. Canisters live on subnets, and different subnets can specialize — some for governance (NNS), some for general computation, some for Bitcoin integration.',
  'q-24': 'ICP supports multiple languages: Motoko (native, designed for ICP), Rust (via CDK), TypeScript (via Azle), and Python (via Kybra). Azle compiles TypeScript to WebAssembly, letting JS developers build on ICP.',
  'q-25': 'The NNS (Network Nervous System) is ICP\'s on-chain government. Users stake ICP in "neurons" and vote on proposals — from upgrading the network to spending treasury funds. It\'s democracy, but for software.',
  'q-26': 'A neuron is a staked ICP token that earns voting power. The more ICP you stake and the longer your dissolve delay (lock-up period), the more influence you have. Neurons earn rewards for participating in governance.',
  'q-27': 'ICP tokens have three uses: (1) Convert to cycles for canister computation, (2) Stake in neurons for NNS governance voting, (3) Earn rewards as staking or node provider rewards. It\'s the fuel, governance, and incentive layer.',
  'q-28': 'Chain-key cryptography lets ICP subnets collectively sign transactions without any single node being trusted. This enables ICP to interact with Bitcoin, Ethereum, and other chains — all without bridges or intermediaries.',
  'q-29': 'ckBTC (chain-key Bitcoin) is a 1:1 backed token on ICP. Real BTC is held in a canister, and ckBTC lets you use Bitcoin on ICP with low fees and fast finality. It\'s like wrapping Bitcoin, but powered by chain-key cryptography.',
  'q-30': 'The SNS (Service Nervous System) lets developers decentralize their dApps. It creates a governance token, a treasury, and hands control to a DAO — similar to how NNS governs ICP, but for individual projects.',

  // ─── DeFi & Tokenomics ───
  'q-31': 'DeFi (Decentralized Finance) recreates traditional financial services — lending, borrowing, trading — using smart contracts instead of banks. No middleman, no paperwork, accessible to anyone with an internet connection.',
  'q-32': 'A DEX (Decentralized Exchange) lets you trade tokens directly with other users via smart contracts. No central authority holds your funds. Examples: ICPSwap on ICP, Uniswap on Ethereum. You swap, you custody.',
  'q-33': 'AMMs (Automated Market Makers) replace traditional order books with mathematical formulas. Prices adjust automatically based on supply and demand in liquidity pools. No human market maker needed.',
  'q-34': 'A liquidity pool is a smart contract holding two tokens (e.g., ICP/ckUSDC). Traders swap against this pool, and liquidity providers (LPs) earn fees from each trade. It\'s the engine behind most DEXs.',
  'q-35': 'Yield farming means moving your crypto across different DeFi protocols to earn the highest returns. You provide liquidity, stake tokens, or lend assets — chasing the best APY. Higher rewards often mean higher risk.',
  'q-36': 'Stablecoins are tokens designed to maintain a stable value, usually pegged 1:1 to USD. ckUSDC on ICP or USDC on Ethereum let you transact without volatility. They\'re the bridge between crypto and traditional finance.',
  'q-37': 'TVL (Total Value Locked) measures how much money is deposited in a DeFi protocol. Higher TVL generally means more trust and usage. It\'s like checking how much money a bank holds — a key health metric.',
  'q-38': 'Impermanent loss happens when you provide liquidity and token prices change significantly. You end up with less value than if you\'d simply held both tokens. It\'s "impermanent" because it only matters when you withdraw.',
  'q-39': 'DeFi lending protocols let you supply tokens to earn interest, or borrow by depositing collateral — all automated by smart contracts. No credit checks, no paperwork. Protocols like Aave and Elluminex (on ICP) lead this space.',
  'q-40': 'Staking means locking tokens to support a network and earn rewards. On ICP, you stake in neurons for governance. On other chains, you might stake to validate transactions. It\'s like earning interest for helping secure the network.',
  'q-41': 'Flash loans let you borrow millions with zero collateral — but you must repay it (plus fees) in the same transaction. If you can\'t repay, the whole transaction reverts. Attackers use them for price manipulation.',
  'q-42': 'ICP has a growing DeFi ecosystem: ICPSwap and Sonic (DEXs), and social platforms like DSCVR and OpenChat integrate token rewards and DeFi mechanics. It\'s still early, but expanding fast.',

  // ─── NFTs & Digital Art ───
  'q-7': 'NFTs (Non-Fungible Tokens) are unique digital tokens representing ownership of specific items — art, music, collectibles, or any digital content. Unlike Bitcoin (which is fungible), each NFT is one-of-a-kind.',
  'q-70': '"Non-fungible" means unique and not interchangeable. A dollar bill is fungible (any dollar works). A painting is non-fungible (there\'s only one original). NFTs bring this uniqueness to digital assets.',
  'q-71': 'Minting is the process of creating a new NFT on the blockchain. You register your digital content (image, music, etc.) and link it to a unique token. It\'s like publishing your work to the blockchain forever.',
  'q-72': 'NFT metadata stores the details: name, description, image URL, and traits (attributes). It\'s what makes your NFT unique — the "fingerprint" that describes the asset. Metadata is usually stored on IPFS.',
  'q-73': 'An NFT marketplace is a platform where users browse, buy, sell, and trade NFTs. Examples include OpenSea, Magic Eden, and Entrepot (on ICP). Think of it as eBay, but for digital collectibles.',
  'q-74': 'Smart contracts define NFT rules: who owns what, how tokens transfer, and royalty percentages. They\'re the legal agreement and enforcement mechanism — all automated and on-chain.',
  'q-75': 'NFT royalties ensure creators earn a percentage (typically 5-10%) every time their work is resold. Smart contracts enforce this automatically — no need to trust the buyer to pay up.',
  'q-76': 'An NFT collection is a set of related NFTs — same creator, theme, or project. Think Bored Apes, Art Blocks, or Candid Cats (on ICP). Collections often have 1,000+ unique pieces with varying rarity.',
  'q-77': 'IPFS (InterPlanetary File System) is a decentralized storage network. NFT images and metadata are stored on IPFS so they\'re permanent and censorship-resistant — not dependent on any single server.',

  // ─── Web3 Security ───
  'q-50': 'Phishing in Web3 uses fake sites, Discord DMs, or social media to trick you into connecting your wallet and signing malicious transactions. Always verify URLs and never sign transactions you don\'t understand.',
  'q-51': 'A rug pull is an exit scam where project founders hype a project, collect funds, then disappear with the money. Red flags: anonymous team, no audit, unverified locked liquidity.',
  'q-52': 'A smart contract audit is a professional security review. Auditors (like Trail of Bits or Certik) examine code for vulnerabilities before deployment. Critical for any project handling real funds.',
  'q-53': 'A honeypot token lets you buy but blocks you from selling. Scammers use hidden logic (blacklisting, transfer restrictions) so only they can cash out. Always test with small amounts.',
  'q-54': 'Your private key or seed phrase gives FULL control of ALL your assets across ALL networks. Never share it. No legitimate service will ever ask for it. Lose it = lose everything.',
  'q-55': 'Hardware wallets (Ledger, Trezor) store private keys on an air-gapped device. Even if your computer is compromised, transactions must be physically confirmed on the device. Gold standard for security.',
  'q-56': 'Approval phishing tricks you into signing unlimited token approvals. Attackers then drain your wallet at will. Always check approval amounts and revoke unused approvals via tools like revoker.app.',
  'q-57': 'Front-running is when MEV bots monitor pending transactions and insert theirs first to profit from price movement. Common on Ethereum; ICP\'s architecture reduces this. It\'s like cutting in line at the mempool.',
  'q-58': 'Reentrancy attacks exploit callbacks to drain funds. An attacker calls a withdrawal function, and before the balance updates, they call it again recursively. The 2016 DAO hack used this. Fixed by checks-effects-interactions pattern.',
  'q-59': 'Flash loan attacks borrow millions in one transaction, manipulate prices, exploit a vulnerability, and repay — all in a single block. It\'s like robbing a bank and returning the money before anyone notices.',
  'q-60': 'Always verify: correct URL (no typosquatting), contract address matches official docs, recent audit reports, community reputation, and use block explorers to verify code. Trust but verify.',

  // ─── Smart Contracts ───
  'q-60s': 'Smart contracts are self-executing programs on a blockchain. When conditions are met, they automatically execute — no intermediaries, no paperwork. They\'re the backbone of DeFi, NFTs, and DAOs.',
  'q-61': 'Solidity is the primary language for Ethereum smart contracts. It\'s a statically-typed language similar to JavaScript, designed specifically for writing decentralized applications on EVM chains.',
  'q-62': 'Gas is the fee paid to execute operations on blockchain. It compensates validators for computational work. On Ethereum, gas prices fluctuate; on ICP, cycle costs are stable and predictable.',
  'q-63': 'Immutability means once a smart contract is deployed, the code cannot be changed. This is a feature (trustworthy) and a risk (bugs are permanent). That\'s why audits and upgradeable patterns matter.',
  'q-64': 'A dApp (decentralized application) combines smart contracts (backend) with a frontend to create fully decentralized apps. No central server, no single point of failure — just code and consensus.',
  'q-65': 'ERC-20 is the standard for creating fungible tokens on Ethereum. USDC, DAI, UNI — they all follow ERC-20 rules. It defines how tokens transfer, how supply works, and how wallets interact.',
  'q-66': 'Upgradeable contracts use proxy patterns to allow code updates while preserving state and address. The logic contract can be swapped, but users interact with the same proxy. Balances flexibility with trust.',
  'q-67': 'Reentrancy is a vulnerability where a function calls back into itself before finishing. Attackers exploit this to drain funds recursively. The DAO hack (2016) lost $60M this way. Prevention: update state before external calls.',
  'q-68': 'OpenZeppelin provides battle-tested, audited smart contract templates for tokens, access control, and more. Instead of writing from scratch, developers use OpenZeppelin\'s secure building blocks.',
  'q-69': 'A testnet is a testing environment that mimics the main blockchain. Developers experiment with fake tokens before deploying to mainnet with real value. ICP has a testnet; Ethereum has Sepolia and Goerli.',
};

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
    { id: 'q-70', categoryId: 'cat-4', question: 'What does "non-fungible" mean?', options: ['Very expensive', 'Unique and not interchangeable', 'Faster than other tokens', 'Open source'], correctAnswer: 'Unique and not interchangeable', explanation: 'Non-fungible means each token is unique — like a one-of-a-kind painting vs a dollar bill.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-71', categoryId: 'cat-4', question: 'What is minting an NFT?', options: ['Selling an NFT', 'Creating a new NFT on the blockchain', 'Buying an NFT', 'Deleting an NFT'], correctAnswer: 'Creating a new NFT on the blockchain', explanation: 'Minting is the process of registering a new NFT on-chain, linking it to digital content.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-72', categoryId: 'cat-4', question: 'What is NFT metadata?', options: ['The NFT price', 'Information describing the NFT (name, attributes, image)', 'The blockchain network', 'A wallet address'], correctAnswer: 'Information describing the NFT (name, attributes, image)', explanation: 'Metadata stores the NFT\'s name, image URL, and traits — what makes it unique.', difficulty: 'intermediate', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-73', categoryId: 'cat-4', question: 'What is an NFT marketplace?', options: ['A physical store', 'A platform to buy, sell, and trade NFTs', 'A type of wallet', 'A blockchain'], correctAnswer: 'A platform to buy, sell, and trade NFTs', explanation: 'Marketplaces like OpenSea and Magic Eden let users browse, buy, and sell NFTs.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-74', categoryId: 'cat-4', question: 'What role do smart contracts play in NFTs?', options: ['They store images', 'They define ownership, transfers, and royalties', 'They mine NFTs', 'They are NFT wallets'], correctAnswer: 'They define ownership, transfers, and royalties', explanation: 'NFT smart contracts define who owns what, how tokens transfer, and royalty percentages.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-75', categoryId: 'cat-4', question: 'What are NFT royalties?', options: ['Tax on NFT sales', 'Percentage of secondary sales paid to the original creator', 'Gas fees', 'Storage costs'], correctAnswer: 'Percentage of secondary sales paid to the original creator', explanation: 'Royalties ensure creators earn money every time their NFT is resold — typically 5-10%.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-76', categoryId: 'cat-4', question: 'What is an NFT collection?', options: ['A single expensive NFT', 'A set of NFTs with a shared theme or creator', 'A type of blockchain', 'A wallet'], correctAnswer: 'A set of NFTs with a shared theme or creator', explanation: 'Collections group related NFTs — like Bored Apes or Art Blocks — often with 1,000+ unique pieces.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
    { id: 'q-77', categoryId: 'cat-4', question: 'What is IPFS in the context of NFTs?', options: ['A payment system', 'A decentralized storage network for NFT files', 'A blockchain', 'A wallet'], correctAnswer: 'A decentralized storage network for NFT files', explanation: 'IPFS stores NFT images and metadata off-chain in a decentralized way, ensuring permanence.', difficulty: 'intermediate', points: 15n, createdAt: 0n, updatedAt: 0n },
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
    { id: 'q-60s', categoryId: 'cat-6', question: 'What is a smart contract?', options: ['A legal agreement', 'Self-executing code on a blockchain', 'A type of wallet', 'A cryptocurrency'], correctAnswer: 'Self-executing code on a blockchain', explanation: 'Smart contracts are programs that automatically execute when conditions are met — no intermediaries needed.', difficulty: 'beginner', points: 10n, createdAt: 0n, updatedAt: 0n },
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

/** Merge lesson content into questions */
function withLessons(questions: Question[]): Question[] {
  return questions.map((q) => ({
    ...q,
    lesson: LESSONS[q.id] ?? 'Read the lesson below, then answer the question.',
  }));
}

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
    { name: 'First Quiz', desc: 'Complete your first quiz', icon: 'target', check: () => score.quizzesCompleted >= 1n },
    { name: 'Quick Learner', desc: 'Complete 10 quizzes', icon: 'book-open', check: () => score.quizzesCompleted >= 10n },
    { name: 'Quiz Master', desc: 'Complete 50 quizzes', icon: 'trophy', check: () => score.quizzesCompleted >= 50n },
    { name: 'Perfect Score', desc: 'Get 100% on any quiz', icon: 'check-circle', check: () => score.correctAnswers === score.totalAnswers && score.totalAnswers > 0n },
    { name: 'Bronze Tier', desc: 'Reach Bronze tier', icon: 'medal-bronze', check: () => score.tier === 'bronze' },
    { name: 'Silver Tier', desc: 'Reach Silver tier', icon: 'medal-silver', check: () => score.tier === 'silver' },
    { name: 'Gold Tier', desc: 'Reach Gold tier', icon: 'medal-gold', check: () => score.tier === 'gold' },
    { name: 'Platinum Tier', desc: 'Reach Platinum tier', icon: 'gem', check: () => score.tier === 'platinum' },
    { name: 'Diamond Tier', desc: 'Reach Diamond tier', icon: 'crown', check: () => score.tier === 'diamond' },
    { name: 'On Fire', desc: '7-day quiz streak', icon: 'flame', check: () => score.streak >= 7n },
    { name: 'Unstoppable', desc: '30-day quiz streak', icon: 'zap', check: () => score.streak >= 30n },
    { name: 'Century', desc: 'Earn 100 XP', icon: 'dumbbell', check: () => score.totalXP >= 100n },
    { name: 'Thousand', desc: 'Earn 1,000 XP', icon: 'star', check: () => score.totalXP >= 1000n },
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
    const actors = getActors();
    if (actors.quizEngine) {
      try {
        const result = await actors.quizEngine.getAllCategories();
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
    await delay(300);
    return MOCK_CATEGORIES;
  },

  async getCategory(id: string): Promise<QuizCategory | null> {
    const actors = getActors();
    if (actors.quizEngine) {
      try {
        const result = await actors.quizEngine.getCategory(id);
        return result[0] ?? null;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
    await delay(200);
    return MOCK_CATEGORIES.find((c) => c.id === id) ?? null;
  },

  // ─── Questions ───
  async getQuestionsByCategory(categoryId: string): Promise<Question[]> {
    const actors = getActors();
    if (actors.quizEngine) {
      try {
        const result = await actors.quizEngine.getQuestionsByCategory(categoryId);
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
    await delay(400);
    return withLessons(MOCK_QUESTIONS[categoryId] ?? []);
  },

  async getQuestion(id: string): Promise<Question | null> {
    await delay(200);
    for (const qs of Object.values(MOCK_QUESTIONS)) {
      const q = qs.find((q) => q.id === id);
      if (q) return { ...q, lesson: LESSONS[q.id] ?? '' };
    }
    return null;
  },

  // ─── Quiz Sessions ───
  async startQuiz(userId: string, categoryId: string): Promise<QuizSession> {
    const actors = getActors();
    if (actors.quizEngine) {
      try {
        const result = await actors.quizEngine.startQuiz(userId, categoryId);
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
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
    const actors = getActors();
    if (actors.quizEngine) {
      try {
        const result = await actors.quizEngine.submitAnswer(sessionId, questionId, selectedAnswer);
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
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
    const actors = getActors();
    if (actors.scoring) {
      try {
        const result = await actors.scoring.updateScore(
          userId,
          BigInt(xpEarned),
          correct,
          BigInt(totalQuestions)
        );
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
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
    const actors = getActors();
    if (actors.scoring) {
      try {
        const result = await actors.scoring.getLeaderboard(BigInt(limit), BigInt(offset));
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
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
    const actors = getActors();
    if (actors.scoring) {
      try {
        const result = await actors.scoring.getUserAchievements(userId);
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
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
    const actors = getActors();
    if (actors.userActor) {
      try {
        const result = await actors.userActor.createUser(
          username,
          displayName,
          principalId,
          authProvider,
          avatar
        );
        return result;
      } catch (e) {
        console.warn('Canister call failed, using mock:', e);
      }
    }
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

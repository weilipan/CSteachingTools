// 模擬 Git 狀態
const gameState = {
    files: {
        working: [],
        staging: [],
    },
    commits: [], // { hash, message, parent, branch }
    branches: {
        'main': { tip: null }, // tip is commit hash
    },
    currentBranch: 'main',
    head: null, // current commit hash
    remoteCommits: []
};

// UI Elements
const ui = {
    working: document.getElementById('container-working'),
    staging: document.getElementById('container-staging'),
    local: document.getElementById('container-local'),
    remote: document.getElementById('container-remote'),
    console: document.getElementById('console-output'),
    modal: document.getElementById('input-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalInput: document.getElementById('modal-input'),
    modalConfirm: document.getElementById('modal-confirm'),
    modalCancel: document.getElementById('modal-cancel'),

    // Indicators
    localBranch: document.querySelector('#local-branch-indicator .current-branch'),
    remoteBranch: document.querySelector('#remote-branch-indicator .current-branch'),
};

// Console Logger
function log(msg, type = 'system') {
    const div = document.createElement('div');
    div.classList.add('console-line', type);
    div.textContent = `> ${msg}`;
    ui.console.appendChild(div);
    ui.console.scrollTop = ui.console.scrollHeight;
}

// Helpers
function generateHash() {
    return Math.random().toString(16).substring(2, 9);
}

function getCommitByHash(hash) {
    return gameState.commits.find(c => c.hash === hash);
}

function render() {
    // 1. Render Working Directory
    ui.working.innerHTML = '';
    gameState.files.working.forEach(file => {
        const el = document.createElement('div');
        el.className = `file-item ${file.status}`;
        el.innerHTML = `<i class="far fa-file"></i> ${file.name}`;
        ui.working.appendChild(el);
    });

    // 2. Render Staging Area
    ui.staging.innerHTML = '';
    gameState.files.staging.forEach(file => {
        const el = document.createElement('div');
        el.className = `file-item staged`;
        el.innerHTML = `<i class="far fa-file"></i> ${file.name}`;
        ui.staging.appendChild(el);
    });

    // 3. Render Local Commits
    ui.local.innerHTML = '';
    // Basic visualization: Linear list, but showing branches is tricky in linear.
    // For this simple viz, we will filter commits that are reachable from HEAD or other branches.
    // But to keep it simple and showing "history", we just show all commits in chronological order reversed.
    const allCommits = gameState.commits.slice().reverse();

    allCommits.forEach(commit => {
        const el = document.createElement('div');
        el.className = 'commit-node';
        if (gameState.head === commit.hash) el.classList.add('current');

        // Check which branches point here
        let tags = '';
        for (const [branchName, branchData] of Object.entries(gameState.branches)) {
            if (branchData.tip === commit.hash) {
                tags += `<span style="background:var(--primary-color);color:#fff;padding:2px 4px;border-radius:4px;font-size:0.7em;margin-left:5px;">${branchName}</span>`;
            }
        }
        if (gameState.head === commit.hash) {
            tags += `<span style="background:var(--danger-color);color:#fff;padding:2px 4px;border-radius:4px;font-size:0.7em;margin-left:5px;">HEAD</span>`;
        }

        el.innerHTML = `
            <div class="commit-hash">#${commit.hash} ${tags}</div>
            <div class="commit-msg">${commit.message}</div>
        `;
        ui.local.appendChild(el);
    });

    // 4. Render Remote Commits (Simplified Sync)
    ui.remote.innerHTML = '';
    gameState.remoteCommits.slice().reverse().forEach(commit => {
        const el = document.createElement('div');
        el.className = 'commit-node';
        el.innerHTML = `
            <div class="commit-hash">#${commit.hash}</div>
            <div class="commit-msg">${commit.message}</div>
        `;
        ui.remote.appendChild(el);
    });

    // 5. Update Branch Indicators
    ui.localBranch.textContent = gameState.currentBranch;
}

// Logic Actions
const actions = {
    createFile: () => {
        const fileName = `file-${Math.floor(Math.random() * 100)}.txt`;
        gameState.files.working.push({ name: fileName, status: 'new' });
        log(`Created ${fileName} in Working Directory`, 'success');
        render();
    },

    add: () => {
        if (gameState.files.working.length === 0) {
            log('No files to add in Working Directory', 'error');
            return;
        }
        while (gameState.files.working.length > 0) {
            const file = gameState.files.working.shift();
            gameState.files.staging.push(file);
        }
        log('Files added to Staging Area', 'success');
        document.getElementById('arrow-add').classList.add('active');
        setTimeout(() => document.getElementById('arrow-add').classList.remove('active'), 1000);
        render();
    },

    commit: async () => {
        if (gameState.files.staging.length === 0) {
            log('Nothing to commit in Staging Area', 'error');
            return;
        }

        const msg = await promptModal('Enter commit message:', 'My changes');
        if (!msg) return;

        const newCommit = {
            hash: generateHash(),
            message: msg,
            parent: gameState.head,
        };

        gameState.commits.push(newCommit);

        // Update pointers
        gameState.head = newCommit.hash;
        gameState.branches[gameState.currentBranch].tip = newCommit.hash;

        gameState.files.staging = [];

        log(`Committed: ${msg} (${newCommit.hash})`, 'success');
        document.getElementById('arrow-commit').classList.add('active');
        setTimeout(() => document.getElementById('arrow-commit').classList.remove('active'), 1000);
        render();
    },

    push: () => {
        // Deep copy all commits to remote (Simplified)
        if (gameState.commits.length === 0) return;

        gameState.remoteCommits = JSON.parse(JSON.stringify(gameState.commits));
        log('Pushed to Remote Repository', 'success');
        document.getElementById('arrow-push').classList.add('active');
        setTimeout(() => document.getElementById('arrow-push').classList.remove('active'), 1000);
        render();
    },

    branch: async () => {
        const name = await promptModal('Enter new branch name:', 'feature-x');
        if (!name) return;

        if (gameState.branches[name]) {
            log(`Branch ${name} already exists`, 'error');
            return;
        }

        // New branch points to current HEAD
        gameState.branches[name] = { tip: gameState.head };
        log(`Created branch ${name}`, 'success');
        render();
    },

    checkout: async () => {
        const available = Object.keys(gameState.branches);
        const name = await promptModal(`Switch branch (Available: ${available.join(', ')})`, '');
        if (!name) return;

        if (!gameState.branches[name]) {
            log(`Branch ${name} does not exist`, 'error');
            return;
        }

        gameState.currentBranch = name;
        gameState.head = gameState.branches[name].tip; // Move HEAD to branch tip

        // Reset working/staging for visualization (Simulate clean checkout)
        // In real git, it might complain if dirty. We'll just clear for simplicity
        gameState.files.working = [];
        gameState.files.staging = [];

        log(`Switched to branch ${name}`, 'success');
        render();
    },

    // Advanced: Merge
    merge: async () => {
        const sourceBranch = await promptModal(`Merge which branch into ${gameState.currentBranch}?`, '');
        if (!sourceBranch || !gameState.branches[sourceBranch]) {
            log('Invalid branch', 'error');
            return;
        }

        if (sourceBranch === gameState.currentBranch) {
            log('Cannot merge branch into itself', 'error');
            return;
        }

        // Simplified Merge: Just update current branch tip to source branch tip (Fast-forward)
        // Or create a merge commit. Let's create a merge commit for visualization.
        const mergeCommit = {
            hash: generateHash(),
            message: `Merge branch '${sourceBranch}'`,
            parent: gameState.head,
            secondParent: gameState.branches[sourceBranch].tip
        };

        gameState.commits.push(mergeCommit);
        gameState.head = mergeCommit.hash;
        gameState.branches[gameState.currentBranch].tip = mergeCommit.hash;

        log(`Merged ${sourceBranch} into ${gameState.currentBranch}`, 'success');
        render();
    },

    // Advanced: Reset
    reset: async () => {
        if (!gameState.head) return;

        // Simplified: Go back 1 commit
        const currentCommit = getCommitByHash(gameState.head);
        if (currentCommit && currentCommit.parent) {
            gameState.head = currentCommit.parent;
            gameState.branches[gameState.currentBranch].tip = gameState.head;
            log(`Reset HEAD to previous commit (${gameState.head})`, 'success');
            render();
        } else {
            log('No parent commit to reset to', 'error');
        }
    }
};


// Modal Logic
let modalResolve = null;

function promptModal(title, placeholder) {
    ui.modalTitle.textContent = title;
    ui.modalInput.value = placeholder || '';
    ui.modal.classList.remove('hidden');
    ui.modalInput.focus();

    return new Promise((resolve) => {
        modalResolve = resolve;
    });
}

ui.modalConfirm.onclick = () => {
    const val = ui.modalInput.value;
    ui.modal.classList.add('hidden');
    if (modalResolve) modalResolve(val);
    modalResolve = null;
};

ui.modalCancel.onclick = () => {
    ui.modal.classList.add('hidden');
    if (modalResolve) modalResolve(null);
    modalResolve = null;
};


// Event Listeners
document.getElementById('btn-create-file').onclick = actions.createFile;
document.getElementById('btn-add').onclick = actions.add;
document.getElementById('btn-commit').onclick = actions.commit;
document.getElementById('btn-push').onclick = actions.push;

document.getElementById('btn-branch').onclick = actions.branch;
document.getElementById('btn-checkout').onclick = actions.checkout;
document.getElementById('btn-merge').onclick = actions.merge;
document.getElementById('btn-reset').onclick = actions.reset;
document.getElementById('reset-tutorial').onclick = () => location.reload();

// Init
render();
log('System ready. Try creating a file!', 'system');

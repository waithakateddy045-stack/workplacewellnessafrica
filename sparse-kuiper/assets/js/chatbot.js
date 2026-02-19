// Workplace Wellness Africa — Self-Contained Wellness Chatbot
// Zero external dependencies. All responses served from local knowledge base.

let knowledgeBase = null;

// Chatbot State
let chatState = {
    mode: 'greeting', // greeting, assessment, conversation, crisis
    assessmentStep: 0,
    assessmentScores: {
        exhaustion: 0,
        cynicism: 0,
        efficacy: 0
    },
    conversationHistory: [],
    lastTopic: null
};

// Burnout Assessment Questions (Inspired by MBI)
const assessmentQuestions = [
    {
        dimension: 'exhaustion',
        question: "How often do you feel emotionally drained from your work?",
        options: [
            { text: "Never", score: 0 },
            { text: "A few times a year", score: 1 },
            { text: "Once a month", score: 2 },
            { text: "A few times a month", score: 3 },
            { text: "Once a week", score: 4 },
            { text: "A few times a week", score: 5 },
            { text: "Every day", score: 6 }
        ]
    },
    {
        dimension: 'cynicism',
        question: "How often do you feel you've become more callous toward people since starting this job?",
        options: [
            { text: "Never", score: 0 },
            { text: "Rarely", score: 1 },
            { text: "Sometimes", score: 2 },
            { text: "Often", score: 3 },
            { text: "Very often", score: 4 },
            { text: "Always", score: 5 }
        ]
    },
    {
        dimension: 'exhaustion',
        question: "How often do you feel used up at the end of the workday?",
        options: [
            { text: "Never", score: 0 },
            { text: "Rarely", score: 1 },
            { text: "Sometimes", score: 2 },
            { text: "Often", score: 3 },
            { text: "Very often", score: 4 },
            { text: "Always", score: 5 }
        ]
    },
    {
        dimension: 'efficacy',
        question: "How often do you feel you're positively influencing others' lives through your work?",
        options: [
            { text: "Every day", score: 6 },
            { text: "A few times a week", score: 5 },
            { text: "Once a week", score: 4 },
            { text: "A few times a month", score: 3 },
            { text: "Once a month", score: 2 },
            { text: "Rarely", score: 1 },
            { text: "Never", score: 0 }
        ],
        reverse: true
    },
    {
        dimension: 'cynicism',
        question: "Do you worry that your job is hardening you emotionally?",
        options: [
            { text: "Not at all", score: 0 },
            { text: "Slightly", score: 1 },
            { text: "Moderately", score: 2 },
            { text: "Quite a bit", score: 3 },
            { text: "Extremely", score: 4 }
        ]
    },
    {
        dimension: 'exhaustion',
        question: "How often do you feel frustrated by your job?",
        options: [
            { text: "Never", score: 0 },
            { text: "Rarely", score: 1 },
            { text: "Sometimes", score: 2 },
            { text: "Often", score: 3 },
            { text: "Very often", score: 4 },
            { text: "Always", score: 5 }
        ]
    }
];

// ─── Knowledge Base Loader ───────────────────────────────────────────

async function loadKnowledgeBase() {
    try {
        const basePath = (typeof SITE_ROOT !== 'undefined') ? SITE_ROOT : '.';
        const response = await fetch(`${basePath}/assets/data/responses.json`);
        knowledgeBase = await response.json();
    } catch (err) {
        console.warn('Could not load responses.json, using fallback responses.');
        knowledgeBase = null;
    }
}

// ─── Keyword Matching Engine ─────────────────────────────────────────

function matchResponse(userMessage) {
    if (!knowledgeBase || !knowledgeBase.topics) return null;

    const input = userMessage.toLowerCase();
    let bestTopic = null;
    let bestScore = 0;

    for (const [topicId, topic] of Object.entries(knowledgeBase.topics)) {
        if (topicId === 'general') continue;

        let score = 0;
        for (const keyword of topic.keywords) {
            if (input.includes(keyword.toLowerCase())) {
                // Longer keywords get higher weight (more specific)
                score += keyword.length;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestTopic = topicId;
        }
    }

    // If no keywords matched, use general fallback
    if (!bestTopic) {
        bestTopic = 'general';
    }

    const topic = knowledgeBase.topics[bestTopic];
    if (!topic || !topic.responses || topic.responses.length === 0) return null;

    // Pick a response — avoid repeating the same one if possible
    let responseIndex = 0;
    if (topic.responses.length > 1 && bestTopic === chatState.lastTopic) {
        responseIndex = 1;
    }

    chatState.lastTopic = bestTopic;
    return topic.responses[responseIndex];
}

function getTopicResponse(topicId) {
    if (!knowledgeBase) return null;

    // Map action names to topic IDs
    const mapping = knowledgeBase.topicActions || {};
    const resolvedId = mapping[topicId] || topicId;

    if (resolvedId === 'resources') {
        return knowledgeBase.resources || null;
    }

    const topic = knowledgeBase.topics?.[resolvedId];
    if (!topic || !topic.responses) return null;

    chatState.lastTopic = resolvedId;
    return topic.responses[0];
}

// ─── Follow-Up Prompt Mapper ─────────────────────────────────────────

function mapFollowUpToAction(text) {
    const lower = text.toLowerCase();
    if (lower.includes('burnout assessment') || lower.includes('take the')) return 'start-assessment';
    if (lower.includes('urgent') || lower.includes('crisis')) return 'crisis-mode';
    if (lower.includes('legal rights') || lower.includes('my rights')) return 'show-legal-rights';
    if (lower.includes('resources') || lower.includes('browse') || lower.includes('view')) return 'show-resources';
    if (lower.includes('self-care') || lower.includes('stress management') || lower.includes('self care')) return 'topic-selfcare';
    if (lower.includes('boundaries') || lower.includes('set boundaries')) return 'topic-boundaries';
    if (lower.includes('salary') || lower.includes('financial')) return 'topic-salary';
    if (lower.includes('burned out') || lower.includes('burnout') || lower.includes('feeling burned')) return 'topic-burnout';
    if (lower.includes('manager') || lower.includes('talk to my manager') || lower.includes('boss')) return 'topic-toxic-leadership';
    if (lower.includes('harassment') || lower.includes('document incidents')) return 'topic-harassment';
    if (lower.includes('professional help') || lower.includes('more support')) return 'crisis-mode';
    if (lower.includes('considering leaving') || lower.includes('should i leave')) return 'topic-career';
    if (lower.includes('talk about') || lower.includes('something else') || lower.includes('workplace issue')) return 'open-conversation';
    return 'open-conversation';
}

// ─── Initialization ──────────────────────────────────────────────────

function initChatbot() {
    const toggler = document.querySelector('.chatbot-toggler');
    const closeBtn = document.querySelector('.close-btn');
    const sendBtn = document.querySelector('#send-btn');
    const chatInput = document.querySelector('#chat-input');

    toggler?.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));
    closeBtn?.addEventListener('click', () => document.body.classList.remove('show-chatbot'));

    sendBtn?.addEventListener('click', handleUserMessage);
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });

    loadKnowledgeBase().then(() => {
        showGreeting();
    });
}

// ─── Greeting ────────────────────────────────────────────────────────

function showGreeting() {
    const greeting = `Hello! I'm your confidential workplace wellness companion from <strong>Workplace Wellness Africa</strong>.

I'm here to help you assess your stress levels and connect you with relevant support resources specific to the Kenyan workplace.

Would you like to:`;

    addMessage(greeting, 'incoming');
    showOptions([
        { text: '🎯 Take a Quick Burnout Assessment', action: 'start-assessment' },
        { text: '💬 Talk about workplace stress', action: 'open-conversation' },
        { text: '🚨 I need urgent help', action: 'crisis-mode' }
    ]);
}

// ─── Message Handling ────────────────────────────────────────────────

function handleUserMessage() {
    const chatInput = document.querySelector('#chat-input');
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'outgoing');
    chatInput.value = '';

    if (chatState.mode === 'conversation') {
        processLocally(userMessage);
    }
}

function handleOption(action, text) {
    addMessage(text, 'outgoing');
    clearOptions();

    switch (action) {
        case 'start-assessment':
            startAssessment();
            break;
        case 'open-conversation':
            openConversation();
            break;
        case 'crisis-mode':
            activateCrisisMode();
            break;
        case 'show-resources':
            showResourceLinks();
            break;
        case 'show-legal-rights':
            showTopicResponse('legal-rights');
            break;
        default:
            if (action.startsWith('assess-')) {
                const score = parseInt(action.split('-')[1]);
                recordAssessmentAnswer(score);
            } else if (action.startsWith('topic-')) {
                showTopicResponse(action);
            } else if (action.startsWith('followup-')) {
                handleFollowUp(action);
            }
    }
}

// ─── Local Response Engine ───────────────────────────────────────────

function processLocally(userMessage) {
    addMessage('<span class="typing-dots">•••</span>', 'incoming', '', true);

    // Simulate slight delay for natural feel
    setTimeout(() => {
        removeTypingIndicator();

        const matched = matchResponse(userMessage);
        if (matched) {
            addMessage(matched.text, 'incoming');
            if (matched.followUps && matched.followUps.length > 0) {
                showFollowUpOptions(matched.followUps);
            }
        } else {
            addMessage(
                "Thank you for sharing. I want to make sure I direct you to the right support. Could you tell me a bit more, or choose one of the options below?",
                'incoming'
            );
            showOptions([
                { text: '📊 Take the Burnout Assessment', action: 'start-assessment' },
                { text: '📚 Browse Resources', action: 'show-resources' },
                { text: '🚨 I need urgent help', action: 'crisis-mode' }
            ]);
        }
    }, 600);
}

function showTopicResponse(topicAction) {
    chatState.mode = 'conversation';
    const response = getTopicResponse(topicAction);

    if (response) {
        addMessage(response.text, 'incoming');
        if (response.followUps && response.followUps.length > 0) {
            showFollowUpOptions(response.followUps);
        }
    } else {
        openConversation();
    }
}

function showResourceLinks() {
    chatState.mode = 'conversation';

    if (knowledgeBase && knowledgeBase.resources) {
        addMessage(knowledgeBase.resources.text, 'incoming');
        if (knowledgeBase.resources.followUps) {
            showFollowUpOptions(knowledgeBase.resources.followUps);
        }
    } else {
        addMessage(
            "<strong>📚 Explore Our Resources:</strong>\n\nVisit our <a href='resources.html'>Knowledge Hub</a> for in-depth articles on workplace wellness, stress management, and employee rights.",
            'incoming'
        );
    }
}

function showFollowUpOptions(followUps) {
    const options = followUps.map((text, i) => ({
        text: text,
        action: `followup-${i}`
    }));

    // Store follow-ups temporarily for resolution
    chatState._pendingFollowUps = followUps;
    showOptions(options);
}

function handleFollowUp(action) {
    const index = parseInt(action.replace('followup-', ''));
    const followUps = chatState._pendingFollowUps || [];
    const selectedText = followUps[index] || '';

    const resolved = mapFollowUpToAction(selectedText);
    handleOption(resolved, selectedText);
}

// ─── Assessment ──────────────────────────────────────────────────────

function startAssessment() {
    chatState.mode = 'assessment';
    chatState.assessmentStep = 0;
    chatState.assessmentScores = { exhaustion: 0, cynicism: 0, efficacy: 0 };

    addMessage("I'll ask you 6 evidence-based questions to assess your burnout risk. Your answers are completely confidential and never stored.", 'incoming');

    setTimeout(() => {
        askAssessmentQuestion();
    }, 1000);
}

function askAssessmentQuestion() {
    const question = assessmentQuestions[chatState.assessmentStep];
    addMessage(question.question, 'incoming');

    const options = question.options.map(opt => ({
        text: opt.text,
        action: `assess-${opt.score}`
    }));

    showOptions(options);
}

function recordAssessmentAnswer(score) {
    const question = assessmentQuestions[chatState.assessmentStep];
    const dimension = question.dimension;
    const finalScore = question.reverse ? (6 - score) : score;
    chatState.assessmentScores[dimension] += finalScore;

    clearOptions();
    chatState.assessmentStep++;

    if (chatState.assessmentStep < assessmentQuestions.length) {
        setTimeout(askAssessmentQuestion, 500);
    } else {
        setTimeout(showAssessmentResults, 500);
    }
}

function showAssessmentResults() {
    const { exhaustion, cynicism, efficacy } = chatState.assessmentScores;

    const exhaustionAvg = exhaustion / 3;
    const cynicismAvg = cynicism / 2;
    const efficacyAvg = efficacy / 1;

    let riskLevel, riskClass, message;

    if (exhaustionAvg >= 3.5 || cynicismAvg >= 2.5 || efficacyAvg <= 2) {
        riskLevel = 'High';
        riskClass = 'crisis-alert';
        message = `<strong>⚠️ High Burnout Risk Detected</strong>

Your responses indicate significant workplace stress. This is not your fault — it's a signal that your current work environment may not be supporting your wellbeing.

<strong>Immediate Steps:</strong>
1. If you're experiencing thoughts of self-harm, contact:
   • Kenya Red Cross: 1199
   • Befrienders Kenya: +254 722 178 177

2. Review your rights under the Kenyan Employment Act
3. Consider documenting workplace stressors
4. Speak with HR or seek professional counselling

Would you like me to connect you with specific resources?`;
    } else if (exhaustionAvg >= 2 || cynicismAvg >= 1.5 || efficacyAvg <= 3.5) {
        riskLevel = 'Moderate';
        riskClass = 'moderate-risk';
        message = `<strong>⚡ Moderate Stress Level</strong>

You're showing early warning signs of burnout. The good news: you're catching this before it becomes acute.

<strong>Recommended Actions:</strong>
1. Implement "Micro-Recovery" breaks (5 min every 2 hours)
2. Set firmer boundaries around after-hours communication
3. Audit your workload with your manager
4. Explore stress management techniques in our Resources Hub

Would you like personalised coping strategies for your specific situation?`;
    } else {
        riskLevel = 'Low';
        riskClass = 'low-risk';
        message = `<strong>✅ Healthy Stress Levels</strong>

Your responses suggest you're managing workplace stress effectively. However, prevention is key!

<strong>Maintain Your Wellness:</strong>
1. Keep up your current coping strategies
2. Stay alert for changes in workload or team dynamics
3. Share what works with colleagues
4. Explore advanced wellness strategies in our Resources Hub

Is there any specific workplace challenge I can help with?`;
    }

    addMessage(message, 'incoming', riskClass);

    showOptions([
        { text: '📚 View Recommended Resources', action: 'show-resources' },
        { text: '💬 Talk about a workplace issue', action: 'open-conversation' },
        { text: '🔄 Retake Assessment', action: 'start-assessment' }
    ]);
}

// ─── Conversation Mode ───────────────────────────────────────────────

function openConversation() {
    chatState.mode = 'conversation';
    addMessage("I'm here to listen. Tell me what's happening at work, and I'll provide contextually relevant support based on Kenyan workplace realities.", 'incoming');

    showOptions([
        { text: 'Salary has been delayed', action: 'topic-salary' },
        { text: 'Facing workplace harassment', action: 'topic-harassment' },
        { text: 'Feeling burned out', action: 'topic-burnout' },
        { text: 'Toxic manager', action: 'topic-toxic-leadership' },
        { text: 'Work-life balance', action: 'topic-family-work' },
        { text: 'Know my legal rights', action: 'show-legal-rights' }
    ]);
}

// ─── Crisis Mode ─────────────────────────────────────────────────────

function activateCrisisMode() {
    chatState.mode = 'crisis';

    const crisisMessage = `<strong>🚨 CRISIS SUPPORT RESOURCES</strong>

If you're in immediate danger or experiencing thoughts of self-harm:

<strong>24/7 Hotlines:</strong>
• Kenya Red Cross: 1199
• Befrienders Kenya: +254 722 178 177
• CHAP - Community Health & Advocacy: +254 722 346 054

<strong>Workplace Crisis:</strong>
If you're facing immediate workplace threats (violence, unlawful termination, safety hazards):
• Ministry of Labour: +254 020 2729800
• COTU Kenya: +254 020 6762766

<strong>Your Safety Matters Most</strong>
You don't have to face this alone. These services are free, confidential, and staffed by trained professionals.`;

    addMessage(crisisMessage, 'incoming', 'crisis-alert');

    showOptions([
        { text: '💬 Talk about my situation', action: 'open-conversation' },
        { text: '📋 View my legal rights', action: 'show-legal-rights' }
    ]);
}

// ─── UI Helper Functions ─────────────────────────────────────────────

function addMessage(text, type, className = '', isTyping = false) {
    const chatbox = document.querySelector('.chatbox');
    if (!chatbox) return;

    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', `chat-${type}`);
    if (className) chatLi.classList.add(className);
    if (isTyping) chatLi.id = 'typing-indicator';

    chatLi.innerHTML = `<p>${text}</p>`;
    chatbox.appendChild(chatLi);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function showOptions(options) {
    const optionsContainer = document.querySelector('.chat-options');
    if (!optionsContainer) return;

    optionsContainer.innerHTML = '';
    optionsContainer.style.display = 'flex';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.text;
        btn.onclick = () => handleOption(opt.action, opt.text);
        optionsContainer.appendChild(btn);
    });
}

function clearOptions() {
    const optionsContainer = document.querySelector('.chat-options');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';
    optionsContainer.style.display = 'none';
}

// ─── Initialize ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initChatbot);

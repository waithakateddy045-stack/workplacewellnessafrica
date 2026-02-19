document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('burnout-meter-container');
    if (container) {
        initBurnoutMeter(container);
    }
});

function initBurnoutMeter(container) {
    container.innerHTML = `
        <div class="burnout-card">
            <div class="meter-header">
                <h3>📉 Burnout Risk Index</h3>
                <p>A clinical pulse-check on your professional stamina.</p>
            </div>
            
            <div class="meter-body">
                <!-- Step 1 -->
                <div class="question-step active" data-step="1">
                    <label>In the last month, how often have you felt emotionally drained *before* the workday starts?</label>
                    <div class="range-container">
                        <span>Rarely</span>
                        <input type="range" class="styled-slider" min="0" max="10" value="3">
                        <span>Daily</span>
                    </div>
                </div>

                <!-- Step 2 -->
                <div class="question-step" data-step="2">
                    <label>Do you find yourself becoming more cynical or critical of your colleagues/clients?</label>
                    <div class="range-container">
                        <span>No</span>
                        <input type="range" class="styled-slider" min="0" max="10" value="2">
                        <span>Yes</span>
                    </div>
                </div>

                <!-- Step 3 -->
                <div class="question-step" data-step="3">
                    <label>How would you rate your ability to experience joy outside of work currently?</label>
                    <div class="range-container">
                        <span>High Joy</span>
                        <input type="range" class="styled-slider" min="0" max="10" value="8" style="direction: rtl"> <!-- Info: High score here is bad for burnout, so we invert logic in calc or visual -->
                        <span>Numb</span>
                    </div>
                    <small style="display:block; margin-top:0.5rem; color:#64748b;">(Slide right if you feel numb/empty)</small>
                </div>

                <div class="meter-controls">
                    <div class="step-dots">
                        <span class="dot active"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                    </div>
                    <button id="next-btn" class="btn-meter">Next →</button>
                    <button id="result-btn" class="btn-meter hidden">Analyze Risk</button>
                </div>
            </div>

            <div id="meter-result" class="meter-result hidden">
                <div class="score-circle">
                    <svg viewBox="0 0 36 36" class="circular-chart">
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path class="circle" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <span class="score-text">0%</span>
                </div>
                <h4 class="risk-title">Calculating...</h4>
                <p class="risk-desc"></p>
                <a href="contact.html" class="risk-action hidden">Talk to a Professional</a>
            </div>
        </div>
    `;

    // Add styles dynamically for the component
    const style = document.createElement('style');
    style.innerHTML = `
        .burnout-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.08);
            max-width: 600px;
            margin: 0 auto;
            overflow: hidden;
            border: 1px solid #f1f5f9;
        }
        .meter-header {
            background: #0f172a;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        .meter-header h3 { color: white; margin: 0; font-family: 'Playfair Display', serif; }
        .meter-header p { opacity: 0.8; font-size: 0.9rem; margin-top: 0.5rem; }
        
        .meter-body { padding: 2rem; }
        
        .question-step { display: none; text-align: center; animation: fadeIn 0.4s ease; }
        .question-step.active { display: block; }
        
        .question-step label { font-size: 1.2rem; font-weight: 600; color: #334155; display: block; margin-bottom: 2rem; }
        
        .range-container {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #64748b;
            font-weight: 500;
        }
        
        .styled-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            border-radius: 5px;
            background: #e2e8f0;
            outline: none;
            transition: background .2s;
        }
        .styled-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #059669;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .meter-controls { margin-top: 2.5rem; display: flex; justify-content: space-between; align-items: center; }
        .step-dots { display: flex; gap: 0.5rem; }
        .dot { width: 10px; height: 10px; border-radius: 50%; background: #e2e8f0; transition: all 0.3s; }
        .dot.active { background: #059669; transform: scale(1.2); }
        
        .btn-meter {
            background: #059669;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-meter:hover { background: #047857; transform: translateY(-2px); }
        .btn-meter.hidden { display: none; }

        .meter-result { padding: 2rem; text-align: center; background: #f8fafc; border-top: 1px solid #e2e8f0; display: none; }
        .meter-result.active { display: block; animation: slideUp 0.5s ease; }
        .hidden { display: none; }

        .score-circle { position: relative; width: 100px; height: 100px; margin: 0 auto 1rem; }
        .circular-chart { display: block; margin: 0 auto; max-width: 100%; max-height: 250px; }
        .circle-bg { fill: none; stroke: #eee; stroke-width: 3.8; }
        .circle { fill: none; stroke-width: 2.8; stroke-linecap: round; transition: stroke-dasharray 1s ease; }
        .score-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.4rem; font-weight: 700; color: #334155; }
        
        .risk-action {
            display: inline-block;
            margin-top: 1rem;
            color: #059669;
            font-weight: 600;
            text-decoration: underline;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);

    // Logic
    let currentStep = 1;
    const totalSteps = 3;
    const nextBtn = document.getElementById('next-btn');
    const resultBtn = document.getElementById('result-btn');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.question-step');

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            slides[currentStep - 1].classList.remove('active');
            dots[currentStep - 1].classList.remove('active');

            currentStep++;

            slides[currentStep - 1].classList.add('active');
            dots[currentStep - 1].classList.add('active');
        }

        if (currentStep === totalSteps) {
            nextBtn.classList.add('hidden');
            resultBtn.classList.remove('hidden');
        }
    });

    resultBtn.addEventListener('click', () => {
        const body = document.querySelector('.meter-body');
        const result = document.getElementById('meter-result');
        const inputs = document.querySelectorAll('.styled-slider');

        // Hide questions
        body.style.display = 'none';
        result.classList.add('active');

        // Calc
        let total = 0;
        inputs.forEach(input => total += parseInt(input.value));
        const percentage = Math.round((total / 30) * 100);

        // Animate Circle
        const circle = document.querySelector('.circle');
        const text = document.querySelector('.score-text');
        const title = document.querySelector('.risk-title');
        const desc = document.querySelector('.risk-desc');
        const action = document.querySelector('.risk-action');

        let color = '#22c55e';
        let status = 'Low Risk';
        let statusDesc = 'Your resilience is high. Keep nurturing your boundaries.';

        if (percentage > 40) {
            color = '#f59e0b';
            status = 'Moderate Risk';
            statusDesc = 'Warning signs detected. You are carrying a heavy cognitive load.';
        }
        if (percentage > 70) {
            color = '#ef4444';
            status = 'High Burnout Risk';
            statusDesc = 'Critical levels. Your nervous system is signaling for immediate rest.';
            action.classList.remove('hidden');
        }

        circle.style.stroke = color;
        circle.setAttribute('stroke-dasharray', `${percentage}, 100`);
        text.textContent = `${percentage}%`;
        text.style.color = color;
        title.textContent = status;
        title.style.color = color;
        desc.textContent = statusDesc;
    });
}

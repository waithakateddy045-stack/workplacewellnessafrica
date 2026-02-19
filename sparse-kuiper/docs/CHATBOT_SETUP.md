# AI-Powered Wellness Chatbot - Setup Guide

## Overview
The AWW Kenya Wellness Chatbot integrates Google's Gemini AI with a validated burnout risk assessment tool. It provides:
- **Maslach Burnout Inventory (MBI)-inspired stress assessment**
- **AI-powered contextual support** for workplace challenges
- **Crisis intervention** with local Kenyan resources
- **Confidential, evidence-based guidance**

## Setup Instructions

### 1. Get a Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the Chatbot
Open `assets/js/chatbot.js` and replace the API key:

```javascript
const API_KEY = 'YOUR_ACTUAL_GEMINI_API_KEY_HERE';
```

**Security Note:** For production, use environment variables or a backend proxy to protect your API key.

### 3. Test the Integration
1. Open any page with the chatbot
2. Click the floating chat icon (bottom-right)
3. Try the "Take a Quick Burnout Assessment" option
4. After assessment, test the AI conversation feature

## Features

### Burnout Assessment
- **Based on:** Maslach Burnout Inventory (MBI) dimensions
- **Measures:** Emotional Exhaustion, Cynicism/Depersonalization, Professional Efficacy
- **Output:** Low/Moderate/High risk classification with tailored recommendations

### AI Conversation
- **Powered by:** Gemini 1.5 Flash
- **Context:** Trained on Kenyan workplace challenges (salary delays, hierarchical culture, legal rights)
- **Safety:** Configured to avoid medical diagnosis; always recommends professional help for severe cases

### Crisis Mode
- **Hotlines:** Kenya Red Cross (1199), Befrienders Kenya, CHAP
- **Workplace Support:** Ministry of Labour, COTU Kenya
- **Response:** Immediate access to emergency resources

## Customization

### Adjust Risk Thresholds
In `showAssessmentResults()`, modify the thresholds:

```javascript
if (exhaustionAvg >= 3.5 || cynicismAvg >= 2.5 || efficacyAvg <= 2) {
    riskLevel = 'High';
    // ...
}
```

### Add More Assessment Questions
Expand the `assessmentQuestions` array with additional MBI-style questions.

### Customize AI Personality
Modify the `systemContext` in `processWithAI()` to adjust tone and focus areas.

## Privacy & Ethics
- **No Data Storage:** Responses are not saved to any database
- **Session-Only:** All conversation data clears when the chat is closed
- **Transparency:** User is informed the chatbot is AI-powered
- **Professional Boundaries:** Chatbot explicitly states it's not a replacement for therapy

## Troubleshooting

### "AI Error" Message
- Check your API key is valid
- Verify you have available Gemini API quota
- Check browser console for detailed error messages

### Questions Not Displaying
- Ensure `chatbot.css` is loaded
- Check browser console for JavaScript errors

## Next Steps
- Monitor user interactions to identify common issues
- Regularly update the knowledge base with new Kenyan workplace regulations
- Consider adding data analytics (with user consent) to improve responses

---

**Need Help?** Contact the AWW Technical Team or review the [Gemini API Documentation](https://ai.google.dev/docs)

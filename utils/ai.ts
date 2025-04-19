import { JournalAnalysis } from '@/types';
import { useSettingsStore } from '@/hooks/useSettingsStore';

// Function to analyze journal entry using the provided API
export const analyzeJournalEntry = async (content: string): Promise<JournalAnalysis | null> => {
  try {
    // Get the OpenAI API key from settings
    const apiKey = useSettingsStore.getState().openAiApiKey;
    
    // If no API key is set, use the Rork toolkit API
    if (!apiKey) {
      return analyzeWithRorkToolkit(content);
    }
    
    // Otherwise, use the OpenAI API directly
    return analyzeWithOpenAI(content, apiKey);
  } catch (error) {
    console.error('Error analyzing journal entry:', error);
    return null;
  }
};

// Function to analyze using Rork toolkit (fallback)
const analyzeWithRorkToolkit = async (content: string): Promise<JournalAnalysis | null> => {
  try {
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `You are a compassionate mental health assistant who speaks in a funny Hinglish style (mix of Hindi and English). Analyze the following journal entry for emotional tone, sentiment, and mental health indicators. 
            Provide a response in JSON format with the following structure:
            {
              "score": (number between 0-100, where 0 is very negative and 100 is very positive),
              "summary": (brief 1-2 sentence summary of the emotional state),
              "suggestions": (array of 3 short, actionable, compassionate suggestions in a funny Hinglish style),
              "keywords": (array of 3-5 emotional keywords from the entry),
              "appreciation": (a brief message of appreciation or encouragement in Hinglish style)
            }
            
            For the Hinglish style, mix Hindi words with English. For example: "Tension mat lo, thoda meditation try karo" or "Aaj ka mood ekdum mast hai!"
            
            Keep suggestions short and practical. Make them sound friendly and slightly humorous.
            
            Only respond with valid JSON. Do not include any other text.`
          },
          {
            role: 'user',
            content: content
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze journal entry');
    }

    const data = await response.json();
    
    // Parse the completion as JSON
    try {
      const analysis = JSON.parse(data.completion);
      return analysis as JournalAnalysis;
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', data.completion);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing with Rork toolkit:', error);
    return null;
  }
};

// Function to analyze using OpenAI API directly
const analyzeWithOpenAI = async (content: string, apiKey: string): Promise<JournalAnalysis | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'system',
            content: `You are a compassionate mental health assistant who speaks in a funny Hinglish style (mix of Hindi and English). Analyze the following journal entry for emotional tone, sentiment, and mental health indicators. 
            Provide a response in JSON format with the following structure:
            {
              "score": (number between 0-100, where 0 is very negative and 100 is very positive),
              "summary": (brief 1-2 sentence summary of the emotional state),
              "suggestions": (array of 3 short, actionable, compassionate suggestions in a funny Hinglish style),
              "keywords": (array of 3-5 emotional keywords from the entry),
              "appreciation": (a brief message of appreciation or encouragement in Hinglish style)
            }
            
            For the Hinglish style, mix Hindi words with English. For example: "Tension mat lo, thoda meditation try karo" or "Aaj ka mood ekdum mast hai!"
            
            Keep suggestions short and practical. Make them sound friendly and slightly humorous.
            
            Only respond with valid JSON. Do not include any other text.`
          },
          {
            role: 'user',
            content: content
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze journal entry with OpenAI');
    }

    const data = await response.json();
    
    // Parse the completion as JSON
    try {
      const analysis = JSON.parse(data.choices[0].message.content);
      return analysis as JournalAnalysis;
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', data.choices[0].message.content);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing with OpenAI:', error);
    return null;
  }
};
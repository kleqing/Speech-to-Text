## Introduction

In this document, I will compare various speech-to-text AI models based on their performance, accuracy, and usability. The models we will be comparing include:
1. Google Speech-to-Text 
2. OpenAI Whisper
3. Deepgram
4. AssemblyAI
5. Microsoft Azure Speech to Text

## Table of contents
<!-- ts -->
* [Performance](#performance)
* [Pricing](#pricing)
<!-- te -->


## Performance

- Rating is based on a combination of accuracy, speed, and language support. This is not included price, as it can vary based on usage and specific requirements.
- Rating score is out of 5, with 5 being the best (High accuracy, low latency, and wide language support).
- The final rating is based on my personal experience and research, and may vary based on specific use cases and requirements. This is a general overview and may not reflect the performance of the models in all scenarios.

| Model                          | Can handle noisy audio | Performance (General) | Accuracy | Language Support | Latency  | Highlighted Features                                                                                                       | Rating |
|--------------------------------|------------------------|-----------------------|----------|------------------|----------|----------------------------------------------------------------------------------------------------------------------------|--------|
| Google Speech-to-Text          | Yes (Best)             | Highest               | High     | 120+ languages   | Low      | Real-time transcription, speaker diarization, punctuation                                                                  | 4.9    |
| OpenAI Whisper                 | Yes (Best)             | Highest               | High     | 100+ languages   | Low      | Open-source, multilingual support, robust to noise                                                                         | 4.8    |
| Deepgram                       | Yes (Good)             | High                  | High     | 30+ languages    | Very low | Real-time transcription, custom vocabulary, speaker diarization                                                            | 4.5    |
| AssemblyAI                     | Yes (Medium)           | High                  | High     | 20+ languages    | Low      | Real-time transcription, suppport nuance analysis (sentiment), summary text and distinguish between speakers (diarization) | 4.4    |
| Microsoft Azure Speech to Text | Yes (Best)             | Highest               | High     | 70+ languages    | Low      | High sercurity, powerful for big enterprises. But setup can be complex and not user friendly.                              | 4.9    |

## Pricing

- Pricing is based on the cost per minute of audio processed, and may vary based on usage, specific features, and subscription plans.
- The pricing information is accurate as of the time of writing, but may change over time.

| Model                          | Pricing (per minute)                        | Free Tier Availability         |
|--------------------------------|---------------------------------------------|--------------------------------|
| Google Speech-to-Text          | \$0.004 - $0.016                            | Yes (60 mins/month)            | 
| OpenAI Whisper                 | \$0.006 per minute                          | Yes (Free for open-source use) |
| Deepgram                       | Pay-as-you-go or \$4K/year                  | Yes (Free \$200 credit)        |
| AssemblyAI                     | \$0.21 - \$0.30 per minute or pay-as-you-go | Yes (Free \$50 credits         |
| Microsoft Azure Speech to Text | \$1.00 per hour                             | Yes (5 hours/month)            |
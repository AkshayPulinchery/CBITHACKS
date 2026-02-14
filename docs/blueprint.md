# **App Name**: SkillRank AI

## Core Features:

- Job Description Analyzer: AI extracts skills, experience, and technologies from the job description using the OpenAI API as a tool.
- Student Profile Upload: Accepts student data via JSON upload, including LeetCode, GitHub, and LinkedIn information.
- Data Scoring Algorithm: Calculates a suitability score based on LeetCode, GitHub, and LinkedIn data with configurable weights.  For now weights for each platform are configurable only in the backend.
- Ranked Candidate Display: Displays a ranked table of candidates from most to least suitable, including key strengths for each.
- Explainable Output: Provides detailed explanations for each student's score, including relevant project and skill data. Text similarity between the candidate skills/projects and job requirements can be performed using the OpenAI API as a tool.

## Style Guidelines:

- Primary color: Dark blue (#243A73), reflecting a sense of professionalism, intelligence, and trust.
- Background color: Light gray (#F0F4F8), providing a clean, neutral backdrop for the data.
- Accent color: Indigo (#4B0082), complementing the primary blue to highlight important information.
- Body text: 'Inter', a sans-serif font for clear, neutral, and modern readability.
- Headline text: 'Space Grotesk', a sans-serif font that goes well with Inter and provides a techy, scientific feel to the headings.
- Simple, professional icons to represent data metrics (e.g., a graph for LeetCode progress, a branch for GitHub repos).
- Clean, tabular layout for displaying candidate rankings and data; focus on readability and scannability.
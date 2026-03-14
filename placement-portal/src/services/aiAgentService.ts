/**
 * AI Agent service: uses OpenAI (ChatGPT) when REACT_APP_OPENAI_API_KEY is set,
 * otherwise returns varied, context-aware responses for placement/career questions.
 */

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const USE_GPT4 = process.env.REACT_APP_OPENAI_GPT4 === 'true';

const SYSTEM_PROMPT = `You are an expert placement and career coach for engineering students in India. You have 10+ years of experience with campus placements, tech interviews, and career transitions.

Your style:
- Be concise (2–4 short paragraphs). Use bullet points when listing steps.
- Give actionable, specific advice—mention tools, platforms, or timeframes when relevant.
- Reference Indian placement context (companies, CTC ranges, tiers) when useful.
- If the student seems stressed, acknowledge it and give one calming tip before advice.
- Never repeat the same phrasing. Vary structure and examples.

Topics you excel at: DSA & coding, system design basics, resume/ATS, behavioral (STAR), company prep (product vs service), salary negotiation, first job, gap years, low CGPA or backlogs, networking, LinkedIn, time management, and choosing between offers.

When they ask follow-ups like "tell me more" or "what about X", go deeper on that sub-topic.`;

export async function getAIResponse(
  userMessage: string,
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  if (OPENAI_API_KEY && OPENAI_API_KEY.length > 10) {
    try {
      const model = USE_GPT4 ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-10),
            { role: 'user', content: userMessage },
          ],
          max_tokens: 450,
          temperature: 0.85,
        }),
      });
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      console.warn('OpenAI API failed, using fallback:', e);
    }
  }

  return getFallbackResponse(userMessage, conversationHistory);
}

/** Deterministic but varied index from message + history for picking responses */
function pickIndex(seed: string, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % max;
}

/** Rich fallback: many topics and varied responses; uses conversation for follow-ups */
function getFallbackResponse(
  userMessage: string,
  history: { role: string; content: string }[] = []
): string {
  const lower = userMessage.toLowerCase().trim();
  const words = lower.split(/\s+/).filter(Boolean);
  const seed = lower + history.map((m) => m.content).join(' ');
  const lastAi = history.filter((m) => m.role === 'assistant').pop()?.content ?? '';
  const isFollowUp =
    /^(tell me more|what about|and|also|more|explain|elaborate|can you|could you|how about|what else|next|go on|continue|yes|no|ok|okay|sure)$/.test(
      lower
    ) || lower.length < 15;

  // Follow-up: expand on last AI topic
  if (isFollowUp && lastAi) {
    const followUps = [
      "One more thing: consistency matters more than intensity. Even 30 minutes daily on one area (e.g. one DSA problem or one STAR story) will compound over 2–3 months.",
      "Also try to get one mock interview or peer practice every week. Real speaking practice is what most students skip until the last moment.",
      "If you have time, note down 3–5 companies you’d love to join and read their recent news and tech blog. It shows in “why us?” answers.",
    ];
    return followUps[pickIndex(seed, followUps.length)];
  }

  // DSA / coding / leetcode
  if (
    lower.includes('dsa') ||
    lower.includes('coding') ||
    lower.includes('leetcode') ||
    lower.includes('algorithm') ||
    lower.includes('data structure')
  ) {
    const dsa = [
      "For DSA: start with arrays, strings, hash maps, then two pointers/sliding window, then trees and graphs. Do 1–2 problems daily; focus on patterns (e.g. two pointers, BFS/DFS) not random problems. Aim for 150–200 quality problems before placement season.",
      "Coding rounds: time complexity and edge cases matter. Practice on LeetCode/CodeChef; in interviews, think aloud and write clean code. Revise recursion, DP, and tree traversal—they come up often.",
      "If you’re weak in DSA: pick one topic per week (e.g. stacks), solve 5–7 problems, then do one mock. Don’t jump topics daily. Consistency beats volume.",
    ];
    return dsa[pickIndex(seed, dsa.length)];
  }

  // Skills / improve / analysis
  if (
    lower.includes('skill') ||
    lower.includes('improve') ||
    lower.includes('analyze my skill') ||
    lower.includes('weak')
  ) {
    const skills = [
      "Focus on three areas: (1) Problem-solving with DSA and system design basics, (2) Clear communication for interviews (STAR, mock practice), (3) One tech stack (e.g. MERN or Python/ML). I can suggest a 4-week plan if you share your branch and target role.",
      "Best ROI: LeetCode/CodeChef for coding, STAR method for behavioral rounds, and one live project. Prioritize consistency—30 mins daily beats 5 hours once a week.",
      "Gap analysis works best when we know your target role. For SDE: DSA + OOP + DB + one framework. For data roles: stats, Python, SQL, and a small ML project. Which role are you aiming for?",
    ];
    return skills[pickIndex(seed, skills.length)];
  }

  // Interview
  if (
    lower.includes('interview') ||
    lower.includes('prepare') ||
    lower.includes('tip') ||
    lower.includes('round')
  ) {
    const interview = [
      "Prepare in this order: (1) Research the company and role, (2) 5–10 STAR stories (conflict, leadership, failure, learning), (3) Revise core CS (OS, DB, networks), (4) Practice speaking aloud. Use the Mock Interview section here for practice.",
      "Technical: Revise complexity, arrays, trees, graphs, and one DB design. Behavioral: leadership, conflict, failure, and “why us?”. Always ask 1–2 thoughtful questions at the end.",
      "Product companies focus more on problem-solving and design; service companies often on tech stack and projects. I can give company-specific tips if you tell me which ones you’re targeting.",
    ];
    return interview[pickIndex(seed, interview.length)];
  }

  // STAR / behavioral / HR
  if (
    lower.includes('star') ||
    lower.includes('behavioral') ||
    lower.includes('hr round') ||
    lower.includes('situation')
  ) {
    const star = [
      "STAR = Situation (brief context), Task (your goal), Action (what you did, step by step), Result (outcome + what you learned). Prepare 5–7 stories covering: teamwork, conflict, failure, leadership, and learning something new. Keep each under 2 minutes.",
      "Common behavioral questions: “Tell me about a conflict,” “Failure and what you learned,” “Leadership example,” “Why us?” Practice out loud and record yourself; fix rambling or vague parts.",
      "In HR rounds, they check fit and communication. Be honest, show enthusiasm for the role, and have 2–3 questions for them (team, projects, growth). Avoid badmouthing previous experiences.",
    ];
    return star[pickIndex(seed, star.length)];
  }

  // Career / path / role
  if (
    lower.includes('career') ||
    lower.includes('path') ||
    lower.includes('guidance') ||
    lower.includes('role')
  ) {
    const career = [
      "Common paths: (1) SDE/Full Stack—high openings, need DSA + web or mobile, (2) Data/Analytics—Python, SQL, stats, (3) Product/Management—projects + communication. Your branch and interests narrow this down.",
      "Your role fit depends on what you enjoy: coding daily → SDE; data and models → Data Science; coordinating teams → PM. Pick one primary path and one backup; prepare accordingly.",
      "Trending now: AI/ML roles, backend/cloud, and full stack. Don’t chase only trends—match with your strengths. A strong profile in one area beats a shallow one in three.",
    ];
    return career[pickIndex(seed, career.length)];
  }

  // Resume / ATS / CV
  if (
    lower.includes('resume') ||
    lower.includes('ats') ||
    lower.includes('cv') ||
    lower.includes('curriculum')
  ) {
    const resume = [
      "For ATS: Use standard headings (Experience, Education, Skills, Projects), bullet points, and keywords from the job description. No tables or images in the body. Use the Resume Analyzer here for an ATS score and suggestions.",
      "Strong resume: 1-page for &lt;3 years, quantifiable results (e.g. “Reduced load time by 40%”), relevant projects, and skills that match the JD. Tailor each application slightly.",
      "Common mistakes: generic objective, no numbers, listing courses instead of projects. Fix these first, then run the Resume Analyzer for a detailed report.",
    ];
    return resume[pickIndex(seed, resume.length)];
  }

  // Placement / job / company
  if (
    lower.includes('placement') ||
    lower.includes('job') ||
    lower.includes('company') ||
    lower.includes('offer')
  ) {
    const placement = [
      "Placement readiness = technical (DSA, projects) + communication (mocks, STAR) + profile (resume, CGPA). Use Company Eligibility and Role Prediction here to see where you stand.",
      "Companies weight things differently: some 80% technical, some 50% fit. Do mocks, improve weak areas, and apply in tiers (dream, target, safe) so you have options.",
      "Start applying when you have 2–3 solid projects and can explain them clearly. Use Mock Interview to practice; then check Company Eligibility to shortlist firms.",
    ];
    return placement[pickIndex(seed, placement.length)];
  }

  // Salary / package / CTC
  if (
    lower.includes('salary') ||
    lower.includes('package') ||
    lower.includes('ctc') ||
    lower.includes('lpa') ||
    lower.includes('negotiat')
  ) {
    const salary = [
      "For campus placements, CTC is often fixed; you can still ask about role, team, and growth. For off-campus or later, research levels.fyi or Glassdoor for the role and city, and negotiate only after you have an offer.",
      "Don’t lead with salary in early rounds. Once you have the offer, you can ask if there’s flexibility; cite market data and your other strengths. Be polite and factual.",
      "First job: focus on learning and role fit as much as pay. A good first role sets up the next 3–5 years. Compare total comp (base + variable + benefits) and growth path.",
    ];
    return salary[pickIndex(seed, salary.length)];
  }

  // CGPA / marks / backlogs
  if (
    lower.includes('cgpa') ||
    lower.includes('gpa') ||
    lower.includes('marks') ||
    lower.includes('backlog') ||
    lower.includes('percentage')
  ) {
    const cgpa = [
      "Many companies have a cutoff (e.g. 7 or 8); check their career page. If you’re below cutoff, focus on companies that don’t filter strictly, and strengthen projects and DSA so you stand out in the rounds you get.",
      "One or two backlogs: clear them and mention in the interview only if asked; focus on what you’ve done since (projects, skills). Don’t apologise repeatedly—show current readiness.",
      "Low CGPA: compensate with strong projects, open source, or certifications. Some startups and product companies care more about skills and attitude than marks. Target them and nail the technical round.",
    ];
    return cgpa[pickIndex(seed, cgpa.length)];
  }

  // Projects
  if (
    lower.includes('project') ||
    lower.includes('portfolio') ||
    lower.includes('github')
  ) {
    const project = [
      "Good projects show: problem chosen, your role, tech used, and impact (e.g. users, performance). 2–3 solid ones are enough. Prefer one full-stack and one in your interest area (ML, mobile, etc.).",
      "Pick projects you can explain in 2 minutes: what, why, how, what you learned. Use GitHub, clear README, and if possible a live link. Quality and clarity beat quantity.",
      "If you don’t have projects yet: build one small app (e.g. todo, blog, API) end-to-end in 2–3 weeks. That’s enough to discuss design, trade-offs, and challenges in interviews.",
    ];
    return project[pickIndex(seed, project.length)];
  }

  // Stress / nervous / confidence
  if (
    lower.includes('stress') ||
    lower.includes('nervous') ||
    lower.includes('confidence') ||
    lower.includes('anxiety') ||
    lower.includes('fear')
  ) {
    const stress = [
      "Nervousness is normal. Reduce it by: (1) Practicing mocks until answers feel automatic, (2) Preparing 2–3 questions to ask them, (3) Focusing on the conversation, not the outcome. Use our Mock Interview to build confidence.",
      "Confidence grows with practice. Do at least 3–5 mock interviews here, record yourself, and fix one thing each time. Most interviewers want you to do well—they’re not trying to trick you.",
      "Before the interview: breathe slowly, review your resume and STAR stories, and remind yourself you’ve prepared. It’s a two-way fit, not a one-way test.",
    ];
    return stress[pickIndex(seed, stress.length)];
  }

  // Time management / schedule
  if (
    lower.includes('time') ||
    lower.includes('schedule') ||
    lower.includes('routine') ||
    lower.includes('balance') ||
    lower.includes('when to start')
  ) {
    const time = [
      "Start placement prep at least 3–4 months before season. Month 1–2: DSA + one project; Month 3: mocks + STAR + company research; Month 4: revise weak areas and stay consistent.",
      "Balance: 60% coding/DSA, 25% communication and mocks, 15% resume and company research. Adjust if one area is clearly weak. Don’t neglect sleep and health—burnout hurts performance.",
      "If you have less time: prioritise DSA patterns (arrays, trees, graphs), one strong project, and 5 STAR stories. Do 2–3 mocks per week in the last month.",
    ];
    return time[pickIndex(seed, time.length)];
  }

  // LinkedIn / networking
  if (
    lower.includes('linkedin') ||
    lower.includes('network') ||
    lower.includes('connect') ||
    lower.includes('referral')
  ) {
    const linkedin = [
      "LinkedIn: complete profile (photo, headline, summary, education, projects, skills). Post or comment occasionally to stay visible. For referrals, connect with alumni or employees; send a short, specific message (role + why you’re interested), not a generic “please refer”.",
      "Networking: attend college talks, hackathons, and online webinars. Follow companies you target; engage with their content. Referrals often skip the first filter—so build a genuine network over time.",
      "When asking for referral: be clear about the role, attach your resume, and mention one concrete reason you’re a fit. Thank them regardless of outcome.",
    ];
    return linkedin[pickIndex(seed, linkedin.length)];
  }

  // System design (basic)
  if (
    lower.includes('system design') ||
    lower.includes('design round') ||
    lower.includes('lld') ||
    lower.includes('hld')
  ) {
    const sys = [
      "For SDE roles, some companies have a system design or design round. Basics: clarify requirements (scale, users), high-level components (API, DB, cache), and one deep dive (e.g. how to scale reads). Practice with YouTube or Grokking; start with simple systems (URL shortener, chat).",
      "In design discussions: think aloud, ask clarifying questions, and justify trade-offs (e.g. SQL vs NoSQL, consistency vs availability). They care about structured thinking more than perfect answers.",
      "If you’re from a non-CS branch: focus on one or two classic problems (e.g. design WhatsApp, rate limiter). Understand the concepts; you don’t need to memorise solutions.",
    ];
    return sys[pickIndex(seed, sys.length)];
  }

  // Hello / thanks / short
  if (
    /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|bye|goodbye)$/.test(lower) ||
    lower.length < 4
  ) {
    const greetings = [
      "Hi! I’m here to help with placements, interviews, resume, or career choices. You can ask about DSA, STAR, resume, salary, CGPA, or time management. What would you like to work on first?",
      "Hello! Ask me anything: skills, interview prep, resume tips, company fit, stress, or a 4-week plan. I’ll keep it practical and specific.",
      "Hey! I can help with coding prep, behavioral rounds, resume/ATS, career path, or how to use the Mock Interview and Company Eligibility here. What’s on your mind?",
    ];
    return greetings[pickIndex(seed, greetings.length)];
  }

  // Default
  const defaults = [
    "I’m not sure I caught that. You can ask about: DSA/coding, interview or STAR tips, resume/ATS, career path, salary, CGPA or backlogs, projects, time management, or stress. I’ll give concrete steps.",
    "To help you better, try a specific question—e.g. “How do I prepare for technical interviews?” or “What should I add to my resume?” or “I have backlogs, what can I do?”",
    "I’m best at: placement prep, interviews (technical + behavioral), resume, skills, and career guidance. Ask in a sentence or two and I’ll give actionable advice.",
  ];
  return defaults[pickIndex(seed, defaults.length)];
}
